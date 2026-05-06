import { useState } from "react";

export interface ProjectItem {
	id: string;
	name: string;
	slug: string;
	access: "owner" | "collaborator";
}

interface ProjectDialogState {
	mode: "create" | "rename" | "delete" | null;
	projectId: string | null;
}

const initialProjects: ProjectItem[] = [
	{
		id: "project-edge-platform",
		name: "Edge Platform",
		slug: "edge-platform",
		access: "owner",
	},
	{
		id: "project-api-mesh",
		name: "API Mesh",
		slug: "api-mesh",
		access: "owner",
	},
	{
		id: "project-partner-portal",
		name: "Partner Portal",
		slug: "partner-portal",
		access: "collaborator",
	},
	{
		id: "project-analytics-lab",
		name: "Analytics Lab",
		slug: "analytics-lab",
		access: "collaborator",
	},
];

function slugifyProjectName(name: string) {
	const slug = name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return slug || "new-project";
}

function createProjectId() {
	return `project-${Date.now().toString(36)}-${Math.random()
		.toString(36)
		.slice(2, 8)}`;
}

function createProjectItem(name: string): ProjectItem {
	return {
		id: createProjectId(),
		name,
		slug: slugifyProjectName(name),
		access: "owner",
	};
}

export function useProjectManagement() {
	const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
	const [selectedProjectId, setSelectedProjectId] = useState(
		initialProjects[0]?.id ?? "",
	);
	const [dialogState, setDialogState] = useState<ProjectDialogState>({
		mode: null,
		projectId: null,
	});
	const [createProjectName, setCreateProjectName] = useState("");
	const [renameProjectName, setRenameProjectName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const dialogProject =
		dialogState.projectId == null
			? undefined
			: projects.find((project) => project.id === dialogState.projectId);

	const createSlugPreview = slugifyProjectName(createProjectName);

	function openCreateDialog() {
		setDialogState({ mode: "create", projectId: null });
		setCreateProjectName("");
		setRenameProjectName("");
	}

	function openRenameDialog(projectId: string) {
		const project = projects.find((item) => item.id === projectId);

		if (!project) {
			return;
		}

		setDialogState({ mode: "rename", projectId });
		setRenameProjectName(project.name);
		setCreateProjectName("");
	}

	function openDeleteDialog(projectId: string) {
		const project = projects.find((item) => item.id === projectId);

		if (!project) {
			return;
		}

		setDialogState({ mode: "delete", projectId });
		setCreateProjectName("");
		setRenameProjectName("");
	}

	function closeDialog() {
		if (isSubmitting) {
			return;
		}

		setDialogState({ mode: null, projectId: null });
		setCreateProjectName("");
		setRenameProjectName("");
	}

	function selectProject(projectId: string) {
		setSelectedProjectId(projectId);
	}

	async function createProject(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmedName = createProjectName.trim();

		if (!trimmedName) {
			return;
		}

		setIsSubmitting(true);
		await Promise.resolve();

		const nextProject = createProjectItem(trimmedName);
		setProjects((currentProjects) => [nextProject, ...currentProjects]);
		setSelectedProjectId(nextProject.id);
		setDialogState({ mode: null, projectId: null });
		setCreateProjectName("");
		setRenameProjectName("");
		setIsSubmitting(false);
	}

	async function renameProject(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const projectId = dialogState.projectId;
		const trimmedName = renameProjectName.trim();

		if (!projectId || !trimmedName) {
			return;
		}

		setIsSubmitting(true);
		await Promise.resolve();

		setProjects((currentProjects) =>
			currentProjects.map((project) =>
				project.id === projectId
					? {
							...project,
							name: trimmedName,
							slug: slugifyProjectName(trimmedName),
						}
					: project,
			),
		);
		setDialogState({ mode: null, projectId: null });
		setRenameProjectName("");
		setCreateProjectName("");
		setIsSubmitting(false);
	}

	async function deleteProject(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const projectId = dialogState.projectId;

		if (!projectId) {
			return;
		}

		setIsSubmitting(true);
		await Promise.resolve();

		setProjects((currentProjects) => {
			const remainingProjects = currentProjects.filter(
				(project) => project.id !== projectId,
			);

			if (selectedProjectId === projectId) {
				setSelectedProjectId(remainingProjects[0]?.id ?? "");
			}

			return remainingProjects;
		});
		setDialogState({ mode: null, projectId: null });
		setCreateProjectName("");
		setRenameProjectName("");
		setIsSubmitting(false);
	}

	return {
		createProjectName,
		createSlugPreview,
		createProject,
		dialogProject,
		dialogState,
		deleteProject,
		isSubmitting,
		openCreateDialog,
		openDeleteDialog,
		openRenameDialog,
		projects,
		renameProject,
		renameProjectName,
		selectedProjectId,
		selectProject,
		setCreateProjectName,
		setRenameProjectName,
		closeDialog,
	};
}
