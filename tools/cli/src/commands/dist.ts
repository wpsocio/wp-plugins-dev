import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { Listr, ListrTask, ListrTaskWrapper, delay } from 'listr2';
import { BaseProjectCommand } from '../baseProjectCommand.js';
import { updateRequirements, updateVersion } from '../utils/dist.js';

export default class Dist extends BaseProjectCommand<typeof Dist> {
	static description = 'Prepares projects for distribution or deployment.';

	static flags = {
		'out-dir': Flags.string({
			char: 'd',
			description:
				'Path to the output directory. Defaults to "dist/{project}".',
		}),
	};

	static args = {
		...BaseProjectCommand.args,
	};

	public async run(): Promise<void> {
		const tasks = new Listr([], {
			concurrent: true,
		});

		for (const project of this.projects) {
			tasks.add({
				title: `Preparing ${project}`,
				task: (_, task) => {
					return task.newListr(this.prepareForDist(project), {
						concurrent: false,
					});
				},
			});
		}

		try {
			await tasks.run();
		} catch (error) {
			this.log(chalk.red((error as { message: string }).message));
			process.exitCode = 1;
		}
	}

	prepareForDist(project: string): Array<ListrTask> {
		return [
			{
				title: 'Update requirements',
				task: async (): Promise<void> => {
					await delay(1000);
					await updateRequirements(project, {
						requirements: {
							requiresPHP: '8.0',
							requiresAtLeast: '6.2',
							testedUpTo: '6.4.1',
						},
						toUpdate: {
							files: [
								'dev.php',
								'src/wptelegram.php',
								'src/README.txt',
								'README.md',
							],
						},
					});
				},
			},
			{
				title: 'Update version',
				task: async (): Promise<void> => {
					const projectSlug = project.split('/')[1];
					const projectName = projectSlug.replace('-', '_');

					await delay(1000);
					await updateVersion(project, '5.0.1', {
						toUpdate: [
							{
								type: 'packageJson',
								files: ['package.json'],
							},
							{
								type: 'composerJson',
								files: ['composer.json'],
							},
							{
								type: 'readmeFiles',
								files: ['README.md', 'src/README.txt'],
							},
							{
								type: 'pluginMainFile',
								files: [`src/${projectSlug}.php`],
							},
							{
								type: 'sinceTag',
								files: ['**/*.php'],
							},
							{
								type: 'general',
								files: [`src/${projectSlug}.php`],
								textPatterns: [
									new RegExp(
										`'${projectName.toUpperCase()}_VER',\\s*'([0-9a-z-+.]+)'`,
									),
								],
							},
						],
					});
				},
			},
		];
	}
}
