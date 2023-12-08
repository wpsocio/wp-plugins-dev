import { v4wp } from '@kucrut/vite-for-wp';
import { wp_scripts } from '@kucrut/vite-for-wp/plugins';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { extractExternalDepsPlugin } from './extract-external-deps-plugin.js';
export { defineConfig };
export function createViteConfig(options) {
    return {
        build: {
            assetsDir: 'dist',
        },
        plugins: [
            v4wp(options),
            wp_scripts(),
            react({
                jsxRuntime: 'classic',
            }),
            {
                name: 'override-config',
                config: () => ({
                    build: {
                        // ensure that manifest.json is not in ".vite/" folder
                        manifest: 'manifest.json',
                    },
                }),
            },
            extractExternalDepsPlugin(),
        ],
    };
}
//# sourceMappingURL=vite.js.map