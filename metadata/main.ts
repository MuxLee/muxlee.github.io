import { bootstrapMetadata } from '@metadata/core.js';

bootstrapMetadata()
    .then(function() {
        process.stdout.write('메타데이터 생성이 완료되었습니다.\n');
    })
    .catch(function(error) {
        process.stdout.write('메타데이터 생성에 실패하였습니다.\n');

        throw error;
    });