import { defineStackbitConfig } from '@stackbit/types';

export default defineStackbitConfig({
    stackbitVersion: '~0.6.0',
    ssgName: 'custom',
    devCommand: 'npm run dev -- -p {port}',
    pagesDir: '.',
    dataDir: '.',
    siteUrl: '/',
    models: {
        page: {
            type: 'page',
            urlPath: '/',
            filePath: 'index.html'
        }
    }
});
