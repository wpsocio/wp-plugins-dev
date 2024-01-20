import path from 'node:path';
import { getPackagesSync } from '@manypkg/get-packages';
import { execaSync } from 'execa';
import { ProjectType, UserConfig, WPProject, fixPackage } from './tools.js';

export type WPMonorepoConfig = {
	rootDir: string;
	projectTypes: UserConfig['projectTypes'];
};

type ProjectStatus = 'ignored' | 'tracked' | 'connected';

type IncludeOptions = {
	[key in ProjectStatus]?: boolean;
};

export class WPMonorepo {
	config: WPMonorepoConfig;

	constructor(config: WPMonorepoConfig) {
		this.config = config;
	}

	/**
	 * Returns an array of connected project names as defined in the CONNECTED_PROJECTS env var.
	 */
	getConnectedProjectsNames() {
		return (process.env.CONNECTED_PROJECTS || '')
			.split(',')
			.map((project) => project.trim())
			.filter(Boolean);
	}

	getProjectStatus(project: WPProject): ProjectStatus {
		// Connected is a subset of ignored, so we need to check for connected first
		if (this.getConnectedProjectsNames().includes(project.packageJson.name)) {
			return 'connected';
		}
		try {
			// If `git check-ignore <pathname>` succeeds, it means the path is ignored
			execaSync('git', ['check-ignore', project.dir]);

			return 'ignored';
		} catch (e) {
			return 'tracked';
		}
	}

	getProjectsByType(projectTypes: Array<ProjectType>) {
		const { packages } = getPackagesSync(this.config.rootDir);

		const projects: Array<WPProject> = [];

		for (const _pkg of packages) {
			const pkg = fixPackage(_pkg);

			let projectType: ProjectType | undefined;

			// If "belongsTo" is defined
			if (pkg.packageJson.wpdev?.belongsTo) {
				if (projectTypes.includes(pkg.packageJson.wpdev?.belongsTo)) {
					projectType = pkg.packageJson.wpdev?.belongsTo;
				}
			} else {
				// If "belongsTo" is not defined, we can use the package containing folder name to determine the project type
				// For example `relativeDir: 'plugins/wptelegram-widget'`
				for (const _type of projectTypes) {
					if (pkg.relativeDir.startsWith(_type)) {
						projectType = _type;
						break;
					}
				}
			}

			if (projectType) {
				projects.push({
					...pkg,
					packageJson: {
						...pkg.packageJson,
						wpdev: {
							...pkg.packageJson.wpdev,
							belongsTo: projectType,
						},
					},
				});
			}
		}

		return projects;
	}

	/**
	 * Get projects.
	 */
	getProjects(include: IncludeOptions) {
		const projects = new Map<string, WPProject>();

		for (const project of this.getProjectsByType(this.config.projectTypes)) {
			const status = this.getProjectStatus(project);

			if (include[status]) {
				projects.set(project.packageJson.name, project);
			}
		}

		return projects;
	}

	getManagedProjects() {
		return this.getProjects({ connected: true, tracked: true });
	}

	getAllProjects() {
		return this.getProjects({ connected: true, tracked: true, ignored: true });
	}

	getProjectsByName(projectNames: Array<string>) {
		const projects = this.getManagedProjects();

		const entries = projectNames.map((projectName) => {
			const project = projects.get(projectName);

			if (!project) {
				throw new Error(
					`Invalid project: Could not find a package with name: "${projectName}"`,
				);
			}

			return [project.packageJson.name, project] as const;
		});

		return new Map(entries);
	}

	/**
	 * Get the symlink path for an item
	 */
	getSymlinkPath(
		{ packageJson: { name, wpdev } }: WPProject,
		wpContentDir: string,
	) {
		// TODO: Use project config to get this info
		// use the package name as the slug
		// It can be something like "@wpsocio/plugin-name"
		const parts = name.split('/');

		const slug = parts[1] || parts[0];

		return path.join(wpContentDir, wpdev?.belongsTo || '', slug);
	}
}
