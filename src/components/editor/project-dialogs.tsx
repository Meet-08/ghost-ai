import { DialogPattern } from "#/components/editor/dialog-pattern.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import type { ProjectItem } from "#/hooks/use-project-management";
import type { FormEvent } from "react";

interface ProjectDialogState {
	mode: "create" | "rename" | "delete" | null;
	projectId: string | null;
}

interface ProjectDialogsProps {
	createProjectName: string;
	createSlugPreview: string;
	dialogProject: ProjectItem | undefined;
	dialogState: ProjectDialogState;
	isSubmitting: boolean;
	renameProjectName: string;
	onClose: () => void;
	onCreateProject: (event: FormEvent<HTMLFormElement>) => Promise<void>;
	onDeleteProject: (event: FormEvent<HTMLFormElement>) => Promise<void>;
	onRenameProject: (event: FormEvent<HTMLFormElement>) => Promise<void>;
	onCreateProjectNameChange: (name: string) => void;
	onRenameProjectNameChange: (name: string) => void;
}

export function ProjectDialogs({
	createProjectName,
	createSlugPreview,
	dialogProject,
	dialogState,
	isSubmitting,
	renameProjectName,
	onClose,
	onCreateProject,
	onDeleteProject,
	onRenameProject,
	onCreateProjectNameChange,
	onRenameProjectNameChange,
}: ProjectDialogsProps) {
	return (
		<>
			<DialogPattern
				title="Create Project"
				description="Enter a project name and review the slug preview before creating it."
				open={dialogState.mode === "create"}
				onOpenChange={(open) => {
					if (!open) {
						onClose();
					}
				}}
				footer={
					<>
						<Button type="button" variant="outline" onClick={onClose}>
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
					onSubmit={onCreateProject}
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
							onChange={(event) =>
								onCreateProjectNameChange(event.target.value)
							}
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
				description={`Rename the current project, ${
					dialogProject ? `"${dialogProject.name}"` : "this project"
				}.`}
				open={dialogState.mode === "rename"}
				onOpenChange={(open) => {
					if (!open) {
						onClose();
					}
				}}
				footer={
					<>
						<Button type="button" variant="outline" onClick={onClose}>
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
					onSubmit={onRenameProject}
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
							onChange={(event) =>
								onRenameProjectNameChange(event.target.value)
							}
							autoFocus
						/>
					</div>
				</form>
			</DialogPattern>

			<DialogPattern
				title="Delete Project"
				description={
					dialogProject
						? `Delete "${dialogProject.name}" from the project list. This action cannot be undone.`
						: "Delete this project from the project list. This action cannot be undone."
				}
				open={dialogState.mode === "delete"}
				onOpenChange={(open) => {
					if (!open) {
						onClose();
					}
				}}
				footer={
					<>
						<Button type="button" variant="outline" onClick={onClose}>
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
					onSubmit={onDeleteProject}
				>
					<p className="text-left text-sm text-muted-foreground">
						This permanently removes the project from the project list.
					</p>
				</form>
			</DialogPattern>
		</>
	);
}
