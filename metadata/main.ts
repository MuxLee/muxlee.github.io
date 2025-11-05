import { bootstrapMetadata } from '@metadata/core';

bootstrapMetadata(import.meta.url)
    .then(function() {
        process.stdout.write('메타데이터 생성이 완료되었습니다.\n');
    })
    .catch(function() {
        process.stdout.write('메타데이터 생성에 실패하였습니다.\n');
    });