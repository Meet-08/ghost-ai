import { AccessDenied } from "#/components/editor/access-denied";
import { EditorCanvas } from "#/components/editor/editor-canvas";
import { EditorNavbar } from "#/components/editor/editor-navbar";
import { ProjectDialogs } from "#/components/editor/project-dialogs";
import { ProjectSidebar } from "#/components/editor/project-sidebar";
import { ShareDialog } from "#/components/editor/share-dialog";
import { useProjectManagement } from "#/hooks/use-project-management";
import { getEditorWorkspace } from "#/server/get-editor-workspace";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bot, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/editor/$projectId")({
	loader: ({ params }) => getEditorWorkspace({ data: params }),
	component: EditorWorkspacePage,
});

function EditorWorkspacePage() {
	const loaderData = Route.useLoaderData();
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
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
					<section className="relative min-w-0 flex-1 overflow-hidden bg-background">
						<EditorCanvas roomId={loaderData.project.id} />

						<aside
							className={`absolute top-0 right-0 z-20 hidden h-full w-80 border-l border-border bg-card/80 backdrop-blur transition-transform duration-300 lg:block ${
								isAISidebarOpen ? "translate-x-0" : "translate-x-full"
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
					</section>
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
