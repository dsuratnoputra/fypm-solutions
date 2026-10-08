import { defineStackbitConfig } from '@stackbit/types';

export default defineStackbitConfig({
    stackbitVersion: '~0.6.0',
    ssgName: 'custom',
    devCommand: 'npx serve . -p {port}',
    contentSources: [],
    pagesDir: '.',
    dataDir: '.'
});
