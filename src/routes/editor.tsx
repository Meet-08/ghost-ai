import { EditorNavbar } from "#/components/editor/editor-navbar";
import { ProjectDialogs } from "#/components/editor/project-dialogs";
import { ProjectSidebar } from "#/components/editor/project-sidebar";
import { Button } from "#/components/ui/button.tsx";
import { useProjectManagement } from "#/hooks/use-project-management";
import { getOwnedProjects } from "#/server/get-owned-projects";
import { requireAuth } from "#/server/require-auth";
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/editor")({
	beforeLoad: () => requireAuth(),
	loader: async () => getOwnedProjects(),
	component: EditorPage,
});

function EditorPage() {
	const location = useLocation();
	const loaderData = Route.useLoaderData();
	const {
		closeDialog,
		createProject,
		createProjectName,
		createSlugPreview,
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
	} = useProjectManagement({
		initialProjects: loaderData.projects,
	});
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	if (location.pathname !== "/editor") {
		return <Outlet />;
	}

	return (
		<>
			<div className="flex h-screen flex-col bg-background">
				<EditorNavbar
					isSidebarOpen={isSidebarOpen}
					onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
				/>
				<ProjectSidebar
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
					projects={projects}
					selectedProjectId={selectedProjectId}
					onSelectProject={selectProject}
					onCreateProject={openCreateDialog}
					onRenameProject={openRenameDialog}
					onDeleteProject={openDeleteDialog}
				/>
				<main className="mt-14 flex-1 overflow-hidden bg-background">
					<div className="flex h-full items-center justify-center px-6 text-center">
						<div className="max-w-xl space-y-4">
							<h1 className="text-3xl font-semibold tracking-tight text-foreground">
								Create a project or open an existing one
							</h1>
							<p className="text-sm text-muted-foreground">
								Start a new architecture workspace, or choose a project from the
								sidebar.
							</p>
							<Button
								type="button"
								size="lg"
								className="gap-2"
								onClick={openCreateDialog}
							>
								<Plus className="size-4" />
								New Project
							</Button>
						</div>
					</div>
				</main>
			</div>

			<ProjectDialogs
				createProjectName={createProjectName}
				createSlugPreview={createSlugPreview}
				dialogProject={dialogProject}
				dialogState={dialogState}
				isSubmitting={isSubmitting}
				renameProjectName={renameProjectName}
				onClose={closeDialog}
				onCreateProject={createProject}
				onDeleteProject={deleteProject}
				onRenameProject={renameProject}
				onCreateProjectNameChange={setCreateProjectName}
				onRenameProjectNameChange={setRenameProjectName}
			/>
		</>
	);
}
