import { Button } from "#/components/ui/button.tsx";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "#/components/ui/tabs.tsx";
import { PencilLine, Plus, Trash2, X } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useState } from "react";

import type { ProjectItem } from "#/hooks/use-project-management";

interface ProjectSidebarProps {
	isOpen: boolean;
	onClose: () => void;
	projects: ProjectItem[];
	selectedProjectId: string;
	onSelectProject: (projectId: string) => void;
	onCreateProject: () => void;
	onRenameProject: (projectId: string) => void;
	onDeleteProject: (projectId: string) => void;
}

export function ProjectSidebar({
	isOpen,
	onClose,
	projects,
	selectedProjectId,
	onSelectProject,
	onCreateProject,
	onRenameProject,
	onDeleteProject,
}: ProjectSidebarProps) {
	const [activeTab, setActiveTab] = useState("my-projects");
	const ownedProjects = projects.filter(
		(project) => project.access === "owner",
	);
	const sharedProjects = projects.filter(
		(project) => project.access === "collaborator",
	);

	function handleProjectKeyDown(
		event: KeyboardEvent<HTMLButtonElement>,
		projectId: string,
	) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onSelectProject(projectId);
		}
	}

	function renderProjectList(projectList: ProjectItem[], showActions: boolean) {
		if (projectList.length === 0) {
			return (
				<div className="flex min-h-40 items-center justify-center rounded-2xl border border-border bg-card px-4 text-center">
					<div>
						<p className="text-sm text-muted-foreground">
							{showActions ? "No projects yet" : "No shared projects"}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{showActions
								? "Create your first project to get started"
								: "Projects shared with you will appear here"}
						</p>
					</div>
				</div>
			);
		}

		return (
			<div className="space-y-2">
				{projectList.map((project) => {
					const isSelected = project.id === selectedProjectId;

					return (
						<div
							key={project.id}
							className={`group relative rounded-2xl border transition-colors ${
								isSelected
									? "border-primary bg-accent/10"
									: "border-border bg-card hover:border-border/80 hover:bg-secondary/40"
							}`}
						>
							<button
								type="button"
								className="block w-full rounded-2xl px-4 py-3 pr-20 text-left outline-none"
								onClick={() => onSelectProject(project.id)}
								onKeyDown={(event) => handleProjectKeyDown(event, project.id)}
							>
								<p className="truncate text-sm font-medium text-foreground">
									{project.name}
								</p>
								<p className="mt-1 truncate text-xs text-muted-foreground">
									{project.slug}
								</p>
							</button>

							{showActions && (
								<div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 opacity-100 transition-opacity group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100">
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										onClick={(event) => {
											event.stopPropagation();
											onRenameProject(project.id);
										}}
										aria-label={`Rename ${project.name}`}
									>
										<PencilLine className="size-4" />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										onClick={(event) => {
											event.stopPropagation();
											onDeleteProject(project.id);
										}}
										aria-label={`Delete ${project.name}`}
									>
										<Trash2 className="size-4" />
									</Button>
								</div>
							)}
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<>
			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm"
					onClick={onClose}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<aside
				aria-hidden={!isOpen}
				inert={!isOpen}
				className={`fixed left-0 top-0 bottom-0 z-40 flex w-64 transform flex-col border-r border-border bg-background transition-transform duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-4 border-b border-border">
					<h2 className="text-base font-semibold">Projects</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						className="p-1"
						tabIndex={isOpen ? 0 : -1}
						aria-label="Close sidebar"
					>
						<X className="size-4" />
					</Button>
				</div>

				{/* Tabs */}
				<div className="flex-1 overflow-hidden flex flex-col">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex-1 flex flex-col px-2 pt-2"
					>
						<TabsList className="w-full">
							<TabsTrigger
								value="my-projects"
								className="flex-1"
								tabIndex={isOpen ? 0 : -1}
							>
								My Projects
							</TabsTrigger>
							<TabsTrigger
								value="shared"
								className="flex-1"
								tabIndex={isOpen ? 0 : -1}
							>
								Shared
							</TabsTrigger>
						</TabsList>

						{/* My Projects Tab */}
						<TabsContent
							value="my-projects"
							className="flex-1 overflow-y-auto px-2 py-3"
							tabIndex={isOpen ? 0 : -1}
						>
							{renderProjectList(ownedProjects, true)}
						</TabsContent>

						{/* Shared Tab */}
						<TabsContent
							value="shared"
							className="flex-1 overflow-y-auto px-2 py-3"
							tabIndex={isOpen ? 0 : -1}
						>
							{renderProjectList(sharedProjects, false)}
						</TabsContent>
					</Tabs>
				</div>

				{/* New Project Button */}
				<div className="px-4 py-4 border-t border-border">
					<Button
						type="button"
						className="w-full"
						size="sm"
						onClick={onCreateProject}
						tabIndex={isOpen ? 0 : -1}
					>
						<Plus className="size-4" />
						New Project
					</Button>
				</div>
			</aside>
		</>
	);
}
