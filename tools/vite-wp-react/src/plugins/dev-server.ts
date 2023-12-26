import fs from 'node:fs';
import path from 'node:path';
import { Plugin, ResolvedConfig } from 'vite';
import { checkAvailablePort } from '../utils/check-available-port.js';

type Options = {
	outDir?: string;
	fileName?: string;
};

const TARGET_PLUGINS = ['vite:react-refresh'];

export function devServer(options: Options = {}): Plugin {
	let devManifestFile: string;
	let resolvedConfig: ResolvedConfig;

	return {
		apply: 'serve',
		name: 'vwpr:dev-server',

		async config(config) {
			let {
				server: { host = 'localhost', port = 5173, ...serverConfig } = {},
			} = config;

			/**
			 * Need to set an actual host
			 * @see https://github.com/vitejs/vite/issues/5241#issuecomment-950272281
			 */
			if (typeof host === 'boolean') {
				host = '0.0.0.0';
			}

			const hmrProtocol = serverConfig.https ? 'wss' : 'ws';
			const serverProtocol = serverConfig.https ? 'https' : 'http';

			port = await checkAvailablePort({ host, port });

			// This will be used by the PHP helper.
			const origin = `${serverProtocol}://${host}:${port}`;

			return {
				server: {
					...serverConfig,
					host,
					origin,
					port,
					strictPort: true,
					hmr: {
						port,
						host,
						protocol: hmrProtocol,
					},
				},
			};
		},

		configResolved(config) {
			resolvedConfig = config;
		},

		buildStart() {
			const { base, build, plugins, server } = resolvedConfig;

			const data = JSON.stringify({
				base,
				origin: server.origin,
				port: server.port,
				plugins: TARGET_PLUGINS.filter((i) =>
					plugins.some(({ name }) => name === i),
				),
			});

			const targetDir = options.outDir || build.outDir;

			devManifestFile = path.join(
				targetDir,
				options.fileName || 'dev-server.json',
			);

			// Ensure the directory exists
			fs.mkdirSync(targetDir, { recursive: true });

			fs.writeFileSync(devManifestFile, data, 'utf8');
		},

		buildEnd() {
			fs.rmSync(devManifestFile, { force: true });
		},
	};
}
