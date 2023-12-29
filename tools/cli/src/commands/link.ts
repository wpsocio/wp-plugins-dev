import { Args, Command, Flags } from '@oclif/core';
import chalk from 'chalk';
import {
	getMonorepoProjects,
	getRealPath,
	getSymlinkPath,
	normalizeProjectsInput,
	validateProject,
} from '../utils/projects.js';
import { SymlinkManager } from '../utils/symlinks.js';

export default class Link extends Command {
	static description =
		'Creates symlinks in the given wp-content directory for the project(s) in this monorepo.';

	static examples = [
		'<%= config.bin %> <%= command.id %> plugins/wptelegram,themes/wptest',
		'<%= config.bin %> <%= command.id %> --all',
	];

	static flags = {
		'wp-content-dir': Flags.string({
			char: 'd',
			description: 'Path to the WordPress content directory.',
			env: 'WP_CONTENT_DIR',
		}),
		all: Flags.boolean({
			description: 'Link all projects.',
		}),
	};

	static strict = false;

	static args = {
		projects: Args.string({
			description: 'Project(s) to link',
		}),
	};

	getInput() {
		return this.parse(Link);
	}

	assertArgs(
		args: Awaited<ReturnType<typeof this.getInput>>['args'],
		flags: Awaited<ReturnType<typeof this.getInput>>['flags'],
	): asserts flags is {
		'wp-content-dir': string;
		all: boolean;
		json: boolean;
	} {
		if (!flags['wp-content-dir']) {
			throw new Error(
				'Please provide a valid WordPress content directory.\n\nYou can set it using the --wp-content-dir option or the WP_CONTENT_DIR environment variable.',
			);
		}
		if (!args.projects?.length && !flags.all) {
			throw new Error('Please provide a project.');
		}
	}

	public async run(): Promise<void> {
		const { args, flags, raw } = await this.getInput();

		try {
			this.assertArgs(args, flags);

			const symlinkManager = new SymlinkManager();

			const projects = flags.all
				? getMonorepoProjects()
				: normalizeProjectsInput(raw);

			for (const project of projects) {
				validateProject(project);
			}

			for (const project of projects) {
				const symlinkPath = getSymlinkPath(project, flags['wp-content-dir']);
				const realPath = getRealPath(project);
				const result = symlinkManager.createSymlink({
					symlinkPath,
					realPath,
				});

				if (result) {
					this.log(result);
				}
			}
		} catch (error) {
			this.log(chalk.red((error as { message: string }).message));
			process.exitCode = 1;
		}
	}
}
