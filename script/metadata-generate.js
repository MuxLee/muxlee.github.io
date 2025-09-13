import fileSystem from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
    LocalComprehensive,
    LocalCategory,
    LocalFilePath,
    LocalPage,
    LocalPost,
    LocalThumbnail
} from './metadata.js';
import { extractMetadata } from './metadata-util.js';

const directoryPath = path.dirname(
    fileURLToPath(import.meta.url)
);
const projectPath = path.join(directoryPath, '../');
const contentPath = path.join(projectPath, 'content');
const publicPath = path.join(projectPath, 'public');
const pageFolderPath = path.join(publicPath, 'page');
const postFolderPath = path.join(publicPath, 'post');
const maximumPostCount = 50;

function generate() {
    const comprehensive = loadComprehensive() || generateComprehensive();
    const localPosts = loadPosts();
    let localPage = loadPage() || generatePage();

    if (!fileSystem.existsSync(pageFolderPath)) {
        fileSystem.mkdirSync(pageFolderPath);
    }
    if (!fileSystem.existsSync(postFolderPath)) {
        fileSystem.mkdirSync(postFolderPath);
    }

    for (let index = 0; index < localPosts.length; index++) {
        const localPost = localPosts[index];

        for (const categoryName of localPost.categories) {
            const localCategory = LocalCategory.withDefault(categoryName);

            localCategory.addPostFilePath = LocalFilePath.fromPost(localPost);
            comprehensive.putCategory = localCategory;
        }

        ignoreGeneratePostFile(localPost);

        localPage.addPost = localPost;

        const isFilledPage = localPage.postCount === maximumPostCount;
        const isLastPost = index + 1 === localPosts.length;

        if (isFilledPage || isLastPost) {
            const latestPage = comprehensive.pages.at(0);

            if (!latestPage || latestPage.fileName !== localPage.fileName) {
                comprehensive.addPage = localPage;
                comprehensive.updatePageCount = comprehensive.pageCount + 1;
            }

            generatePageFile(localPage);
        }
        if (isLastPost) {
            comprehensive.updateLatestPage = localPage;
            comprehensive.updateLatestPost = localPost;
            comprehensive.updateLatestCategories = localPost.categories;

            break;
        }
        if (isFilledPage) {
            localPage = generatePage();
        }
    }

    comprehensive.updatePostCount = comprehensive.postCount + localPosts.length;

    generateComprehensiveFile(comprehensive);
}

/**
 * 기본 종합 정보를 생성하여 반환합니다.
 *
 * @returns {LocalComprehensive} 종합 정보
 */
function generateComprehensive() {
    return LocalComprehensive.withDefault();
}

/**
 * 종합 정보를 파일로 생성합니다.
 *
 * @param {LocalComprehensive} comprehensive
 * @returns {void}
 */
function generateComprehensiveFile(comprehensive) {
    const comprehensiveFilePath = path.join(publicPath, 'comprehensive.json');
    const comprehensiveData = JSON.stringify(comprehensive, null, 4);

    fileSystem.writeFileSync(comprehensiveFilePath, comprehensiveData);
}


/**
 * 기본 로컬 페이지 정보를 생성하여 반환합니다.
 *
 * @returns {LocalPage} 로컬 페이지
 */
function generatePage() {
    const folderPath = pageFolderPath.replace(projectPath, '');

    return LocalPage.withDefault(folderPath);
}

/**
 * 페이지 정보를 파일로 생성합니다.
 *
 * @param {Page} page
 * @returns {void}
 */
function generatePageFile(page) {
    const pageFilePath = path.join(projectPath, page.fullPath);
    const pageJSON = JSON.stringify(page, null, 4);

    fileSystem.writeFileSync(pageFilePath, pageJSON);
}

/**
 * 게시글 파일을 생성 대상에서 제외시킵니다.
 *
 * @param {LocalPost} localPost
 * @returns {void}
 */
function ignoreGeneratePostFile(localPost) {
    const postFilePath = path.join(projectPath, localPost.folderPath, localPost.generateFileName);
    const newPostFilePath = path.join(projectPath, localPost.fullPath);

    fileSystem.renameSync(postFilePath, newPostFilePath);
}

/**
 * 종합 정보를 불러와 반환합니다.
 *
 * @returns {Optional<LocalComprehensive>}
 */
function loadComprehensive() {
    const comprehensiveFilePath = path.join(contentPath, 'comprehensive.json');
    const isExistComprehensiveFile = fileSystem.existsSync(comprehensiveFilePath);

    if (isExistComprehensiveFile) {
        const comprehensiveFile = fileSystem.readFileSync(comprehensiveFilePath, 'utf8');
        /**
         * @type {LocalComprehensive}
         */
        const comprehensive = JSON.parse(comprehensiveFile);

        return new LocalComprehensive(comprehensive);
    }

    return null;
}

/**
 * 로컬 페이지 정보를 불러와 반환합니다.
 *
 * @returns {Optional<LocalPage>} 로컬 페이지
 */
function loadPage() {
    const pageDirectoryPath = path.join(contentPath, 'page');
    const hasFiles = fileSystem.existsSync(pageDirectoryPath);

    if (hasFiles) {
        const fileNames = fileSystem.readdirSync(pageDirectoryPath);

        for (let index = fileNames.length - 1; index >= 0; index--) {
            const fileName = fileNames[index];

            if (fileName.endsWith('.page.json')) {
                const pageFilePath = path.join(pageDirectoryPath, fileName);
                const pageFile = fileSystem.readFileSync(pageFilePath, 'utf8');
                /**
                 * @type {LocalPage}
                 */
                const localPage = JSON.parse(pageFile);

                if (localPage.postCount < maximumPostCount) {
                    return new LocalPage(localPage);
                }
            }
        }
    }

    return null;
}

/**
 * 모든 게시글 정보를 불러와 반환합니다.
 *
 * @returns {LocalPost[]} 게시글 목록
 */
function loadPosts() {
    /**
     * @type {LocalPost[]}
     */
    const posts = [];
    const postDirectoryPath = path.join(contentPath, 'post');
    const hasContentDirectory = fileSystem.existsSync(postDirectoryPath);

    if (hasContentDirectory) {
        const fileNames = fileSystem.readdirSync(postDirectoryPath);

        for (const fileName of fileNames) {
            const isMarkdownFile = fileName.endsWith('.generate.md');

            if (isMarkdownFile) {
                const postFilePath = path.join(postDirectoryPath, fileName);
                const postFile = fileSystem.readFileSync(postFilePath, 'utf8');
                const post = extractMetadata(postFile);

                if (post) {
                    const folderPath = postDirectoryPath.replace(projectPath, '');
                    const newFileName = fileName.replace('.generate', '');

                    Object.defineProperties(post, {
                        fileName: {
                            value: newFileName
                        },
                        folderPath: {
                            value: folderPath
                        },
                        generateFileName: {
                            value: fileName,
                        },
                        thumbnail: {
                            value: new LocalThumbnail(post.thumbnail)
                        }
                    });

                    const localPost = new LocalPost(post);

                    posts.push(localPost);
                }
            }
        }
    }

    return posts.sort((former, latter) =>
        Number.parseInt(former.fileName) - Number.parseInt(latter.fileName));
}

generate(contentPath);

export {
    generate
};
