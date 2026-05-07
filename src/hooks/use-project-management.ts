import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export interface ProjectItem {
	id: string;
	name: string;
	access?: "owner" | "collaborator";
}

interface ProjectDialogState {
	mode: "create" | "rename" | "delete" | null;
	projectId: string | null;
}

function slugifyProjectName(name: string) {
	const slug = name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return slug || "new-project";
}

export interface UseProjectManagementProps {
	initialProjects: ProjectItem[];
	initialSelectedProjectId?: string;
	onProjectCreated?: (projectId: string) => Promise<void> | void;
}

export function useProjectManagement({
	initialProjects,
	initialSelectedProjectId,
	onProjectCreated,
}: UseProjectManagementProps) {
	const navigate = useNavigate();
	const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
	const [selectedProjectId, setSelectedProjectId] = useState(
		initialSelectedProjectId ?? initialProjects[0]?.id ?? "",
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

		try {
			const response = await fetch("/api/projects", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: trimmedName }),
			});

			if (!response.ok) {
				throw new Error("Failed to create project");
			}

			const data = await response.json();
			const newProject = data.project;

			setProjects((currentProjects) => [newProject, ...currentProjects]);
			setSelectedProjectId(newProject.id);
			setDialogState({ mode: null, projectId: null });
			setCreateProjectName("");
			setRenameProjectName("");
			setIsSubmitting(false);
			await onProjectCreated?.(newProject.id);
		} catch (err) {
			console.error("Failed to create project:", err);
			setIsSubmitting(false);
		}
	}

	async function renameProject(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const projectId = dialogState.projectId;
		const trimmedName = renameProjectName.trim();

		if (!projectId || !trimmedName) {
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch(`/api/projects/${projectId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: trimmedName }),
			});

			if (!response.ok) {
				throw new Error("Failed to rename project");
			}

			const data = await response.json();
			const updatedProject = data.project;

			setProjects((currentProjects) =>
				currentProjects.map((project) =>
					project.id === projectId ? updatedProject : project,
				),
			);
			setDialogState({ mode: null, projectId: null });
			setRenameProjectName("");
			setCreateProjectName("");
			setIsSubmitting(false);
		} catch (err) {
			console.error("Failed to rename project:", err);
			setIsSubmitting(false);
		}
	}

	async function deleteProject(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const projectId = dialogState.projectId;

		if (!projectId) {
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch(`/api/projects/${projectId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete project");
			}

			const wasDeleted = selectedProjectId === projectId;

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

			// If we deleted the selected project, redirect to home
			if (wasDeleted) {
				setIsSubmitting(false);
				await navigate({ to: "/editor" });
			} else {
				setIsSubmitting(false);
			}
		} catch (err) {
			console.error("Failed to delete project:", err);
			setIsSubmitting(false);
		}
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
