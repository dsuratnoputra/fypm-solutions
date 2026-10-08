import { defineStackbitConfig } from '@stackbit/types';

export default defineStackbitConfig({
    stackbitVersion: '~0.6.0',
    ssgName: 'custom',
    devCommand: 'npx serve . -p {port}',
    pagesDir: '.',
    dataDir: '.',
    models: {
        page: {
            type: 'page',
            urlPath: '/',
            filePath: 'index.html'
        }
    }
});
