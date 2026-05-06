import { DialogPattern } from "#/components/editor/dialog-pattern.tsx";
import { EditorNavbar } from "#/components/editor/editor-navbar";
import { ProjectSidebar } from "#/components/editor/project-sidebar";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { useProjectManagement } from "#/hooks/use-project-management";
import { requireAuth } from "#/server/require-auth";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/editor")({
	beforeLoad: () => requireAuth(),
	component: EditorPage,
});

function EditorPage() {
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
	} = useProjectManagement();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

			<DialogPattern
				title="Create Project"
				description="Enter a project name and review the slug preview before creating it."
				open={dialogState.mode === "create"}
				onOpenChange={(open) => {
					if (!open) {
						closeDialog();
					}
				}}
				footer={
					<>
						<Button type="button" variant="outline" onClick={closeDialog}>
							Cancel
						</Button>
						<Button
							type="submit"
							form="create-project-form"
							disabled={isSubmitting || !createProjectName.trim()}
						>
							Create Project
						</Button>
					</>
				}
			>
				<form
					id="create-project-form"
					className="space-y-4"
					onSubmit={createProject}
				>
					<div className="space-y-2 text-left">
						<label
							htmlFor="create-project-name"
							className="text-sm font-medium text-foreground"
						>
							Project name
						</label>
						<Input
							id="create-project-name"
							value={createProjectName}
							onChange={(event) => setCreateProjectName(event.target.value)}
							autoFocus
							placeholder="e.g. Payments Workspace"
						/>
					</div>
					<div className="rounded-2xl border border-border bg-card px-4 py-3 text-left">
						<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
							Slug preview
						</p>
						<p className="mt-2 font-mono text-sm text-foreground">
							{createSlugPreview}
						</p>
					</div>
				</form>
			</DialogPattern>

			<DialogPattern
				title="Rename Project"
				description={`Rename the current project, ${dialogProject ? `"${dialogProject.name}"` : "this project"}.`}
				open={dialogState.mode === "rename"}
				onOpenChange={(open) => {
					if (!open) {
						closeDialog();
					}
				}}
				footer={
					<>
						<Button type="button" variant="outline" onClick={closeDialog}>
							Cancel
						</Button>
						<Button
							type="submit"
							form="rename-project-form"
							disabled={isSubmitting || !renameProjectName.trim()}
						>
							Save Changes
						</Button>
					</>
				}
			>
				<form
					id="rename-project-form"
					className="space-y-4"
					onSubmit={renameProject}
				>
					<div className="space-y-2 text-left">
						<label
							htmlFor="rename-project-name"
							className="text-sm font-medium text-foreground"
						>
							Project name
						</label>
						<Input
							id="rename-project-name"
							value={renameProjectName}
							onChange={(event) => setRenameProjectName(event.target.value)}
							autoFocus
						/>
					</div>
				</form>
			</DialogPattern>

			<DialogPattern
				title="Delete Project"
				description={
					dialogProject
						? `Delete "${dialogProject.name}" from the mock project list. This action cannot be undone.`
						: "Delete this project from the mock project list. This action cannot be undone."
				}
				open={dialogState.mode === "delete"}
				onOpenChange={(open) => {
					if (!open) {
						closeDialog();
					}
				}}
				footer={
					<>
						<Button type="button" variant="outline" onClick={closeDialog}>
							Cancel
						</Button>
						<Button
							type="submit"
							form="delete-project-form"
							variant="destructive"
							disabled={isSubmitting}
						>
							Delete Project
						</Button>
					</>
				}
			>
				<form
					id="delete-project-form"
					className="space-y-4"
					onSubmit={deleteProject}
				>
					<p className="text-left text-sm text-muted-foreground">
						This permanently removes the project from the mock list.
					</p>
				</form>
			</DialogPattern>
		</>
	);
}
