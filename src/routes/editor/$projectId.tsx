import { AccessDenied } from "#/components/editor/access-denied";
import { EditorNavbar } from "#/components/editor/editor-navbar";
import { ProjectDialogs } from "#/components/editor/project-dialogs";
import { ProjectSidebar } from "#/components/editor/project-sidebar";
import { ShareDialog } from "#/components/editor/share-dialog";
import { useProjectManagement } from "#/hooks/use-project-management";
import { getEditorWorkspace } from "#/server/get-editor-workspace";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bot, Grid2X2, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/editor/$projectId")({
	loader: ({ params }) => getEditorWorkspace({ data: params }),
	component: EditorWorkspacePage,
});

function EditorWorkspacePage() {
	const loaderData = Route.useLoaderData();
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isAISidebarOpen, setIsAISidebarOpen] = useState(true);
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
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
		setCreateProjectName,
		setRenameProjectName,
	} = useProjectManagement({
		initialProjects: loaderData.projects,
		initialSelectedProjectId: loaderData.project?.id,
		onProjectCreated: async (projectId) => {
			await navigate({
				to: "/editor/$projectId",
				params: { projectId },
			});
		},
	});

	async function selectProject(projectId: string) {
		await navigate({
			to: "/editor/$projectId",
			params: { projectId },
		});
	}

	if (!loaderData.hasAccess || !loaderData.project) {
		return <AccessDenied />;
	}

	return (
		<>
			<div className="flex h-screen flex-col overflow-hidden bg-background">
				<EditorNavbar
					isSidebarOpen={isSidebarOpen}
					onSidebarToggle={() => setIsSidebarOpen((current) => !current)}
					projectName={loaderData.project.name}
					isAISidebarOpen={isAISidebarOpen}
					onAISidebarToggle={() => setIsAISidebarOpen((current) => !current)}
					onShareOpen={() => setIsShareDialogOpen(true)}
					showWorkspaceActions
				/>

				<ProjectSidebar
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
					projects={projects}
					selectedProjectId={loaderData.project.id}
					onSelectProject={selectProject}
					onCreateProject={openCreateDialog}
					onRenameProject={openRenameDialog}
					onDeleteProject={openDeleteDialog}
				/>

				<main className="mt-14 flex min-h-0 flex-1 overflow-hidden bg-background">
					<section className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-background">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-primary-dim),transparent_35%)]" />
						<div className="absolute inset-0 opacity-20 [background-image:linear-gradient(var(--border-default)_1px,transparent_1px),linear-gradient(90deg,var(--border-default)_1px,transparent_1px)] [background-size:48px_48px]" />
						<div className="relative mx-6 max-w-md rounded-3xl border border-border bg-card/80 px-8 py-10 text-center shadow-2xl backdrop-blur">
							<div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-secondary">
								<Grid2X2 className="size-7 text-muted-foreground" />
							</div>
							<h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
								Canvas coming next
							</h1>
							<p className="mt-3 text-sm leading-6 text-muted-foreground">
								{loaderData.project.name} is ready. The collaborative canvas
								will fill this workspace in the next feature pass.
							</p>
						</div>
					</section>

					<aside
						className={`hidden w-80 shrink-0 border-l border-border bg-card/80 backdrop-blur transition-[width,opacity] duration-300 lg:block ${
							isAISidebarOpen ? "opacity-100" : "w-0 opacity-0"
						}`}
						aria-hidden={!isAISidebarOpen}
					>
						<div className="flex h-full flex-col">
							<div className="border-b border-border px-5 py-4">
								<div className="flex items-center gap-2 text-sm font-medium text-foreground">
									<Bot className="size-4 text-muted-foreground" />
									AI Assistant
								</div>
							</div>
							<div className="flex flex-1 items-center justify-center px-6 text-center">
								<div>
									<Sparkles className="mx-auto size-8 text-muted-foreground" />
									<p className="mt-4 text-sm font-medium text-foreground">
										AI chat placeholder
									</p>
									<p className="mt-2 text-xs leading-5 text-muted-foreground">
										Prompting and generation behavior stays out of this shell.
									</p>
								</div>
							</div>
						</div>
					</aside>
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

			<ShareDialog
				open={isShareDialogOpen}
				projectId={loaderData.project.id}
				projectName={loaderData.project.name}
				access={loaderData.project.access}
				onOpenChange={setIsShareDialogOpen}
			/>
		</>
	);
}
