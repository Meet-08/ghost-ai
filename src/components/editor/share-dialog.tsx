import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/editor/dialog-pattern.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { cn } from "#/lib/utils.ts";
import { Check, Copy, Loader2, Trash2, UserRound } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";

type ProjectAccess = "owner" | "collaborator";

interface CollaboratorProfile {
	id: string;
	email: string;
	displayName: string | null;
	avatarUrl: string | null;
	createdAt: string;
}

interface CollaboratorsResponse {
	collaborators: CollaboratorProfile[];
	access: ProjectAccess;
	error?: string;
}

interface ShareDialogProps {
	open: boolean;
	projectId: string;
	projectName: string;
	access: ProjectAccess;
	onOpenChange: (open: boolean) => void;
}

function getInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

async function readCollaboratorsResponse(response: Response) {
	const data = (await response.json()) as CollaboratorsResponse;

	if (!response.ok) {
		throw new Error(data.error ?? "Unable to update collaborators");
	}

	return data;
}

export function ShareDialog({
	open,
	projectId,
	projectName,
	access,
	onOpenChange,
}: ShareDialogProps) {
	const [collaborators, setCollaborators] = useState<CollaboratorProfile[]>([]);
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [removingId, setRemovingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const projectLink = useMemo(() => {
		if (typeof window === "undefined") {
			return "";
		}

		return `${window.location.origin}/editor/${projectId}`;
	}, [projectId]);
	const canManage = access === "owner";

	useEffect(() => {
		if (!open) {
			return;
		}

		let isActive = true;

		async function loadCollaborators() {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`/api/projects/${projectId}/collaborators`,
				);
				const data = await readCollaboratorsResponse(response);

				if (isActive) {
					setCollaborators(data.collaborators);
				}
			} catch (caughtError) {
				if (isActive) {
					setError(
						caughtError instanceof Error
							? caughtError.message
							: "Unable to load collaborators",
					);
				}
			} finally {
				if (isActive) {
					setIsLoading(false);
				}
			}
		}

		void loadCollaborators();

		return () => {
			isActive = false;
		};
	}, [open, projectId]);

	async function inviteCollaborator(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!email.trim()) {
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch(`/api/projects/${projectId}/collaborators`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			const data = await readCollaboratorsResponse(response);

			setCollaborators(data.collaborators);
			setEmail("");
		} catch (caughtError) {
			setError(
				caughtError instanceof Error
					? caughtError.message
					: "Unable to invite collaborator",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	async function removeCollaborator(collaboratorId: string) {
		setRemovingId(collaboratorId);
		setError(null);

		try {
			const response = await fetch(`/api/projects/${projectId}/collaborators`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ collaboratorId }),
			});
			const data = await readCollaboratorsResponse(response);

			setCollaborators(data.collaborators);
		} catch (caughtError) {
			setError(
				caughtError instanceof Error
					? caughtError.message
					: "Unable to remove collaborator",
			);
		} finally {
			setRemovingId(null);
		}
	}

	async function copyProjectLink() {
		try {
			await navigator.clipboard.writeText(projectLink);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			setError("Unable to copy the project link");
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-3xl border-border bg-background sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>Share Project</DialogTitle>
					<DialogDescription>
						Manage access for {projectName}.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-5">
					<div className="rounded-2xl border border-border bg-card p-4">
						<div className="flex items-center gap-2">
							<Input value={projectLink} readOnly aria-label="Project link" />
							<Button
								type="button"
								variant="outline"
								onClick={copyProjectLink}
								className="min-w-24 gap-2"
							>
								{copied ? (
									<Check className="size-4" />
								) : (
									<Copy className="size-4" />
								)}
								{copied ? "Copied!" : "Copy"}
							</Button>
						</div>
					</div>

					{canManage && (
						<form className="flex gap-2" onSubmit={inviteCollaborator}>
							<Input
								type="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="teammate@example.com"
								aria-label="Collaborator email"
							/>
							<Button
								type="submit"
								disabled={isSubmitting || !email.trim()}
								className="min-w-20"
							>
								{isSubmitting ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									"Invite"
								)}
							</Button>
						</form>
					)}

					{error && (
						<p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
							{error}
						</p>
					)}

					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-medium text-foreground">
								Collaborators
							</h3>
							<span className="text-xs text-muted-foreground">
								{collaborators.length} total
							</span>
						</div>

						<div className="max-h-72 space-y-2 overflow-y-auto pr-1">
							{isLoading ? (
								<div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
									<Loader2 className="size-4 animate-spin" />
									Loading collaborators
								</div>
							) : collaborators.length === 0 ? (
								<div className="rounded-2xl border border-border bg-card px-4 py-5 text-center text-sm text-muted-foreground">
									No collaborators yet.
								</div>
							) : (
								collaborators.map((collaborator) => {
									const label = collaborator.displayName ?? collaborator.email;

									return (
										<div
											key={collaborator.id}
											className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-3"
										>
											<div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary text-xs font-medium text-foreground">
												{collaborator.avatarUrl ? (
													<img
														src={collaborator.avatarUrl}
														alt=""
														className="size-full object-cover"
													/>
												) : label ? (
													getInitials(label)
												) : (
													<UserRound className="size-4" />
												)}
											</div>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-medium text-foreground">
													{label}
												</p>
												<p
													className={cn(
														"truncate text-xs text-muted-foreground",
														!collaborator.displayName && "sr-only",
													)}
												>
													{collaborator.email}
												</p>
											</div>
											{canManage && (
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													onClick={() => removeCollaborator(collaborator.id)}
													disabled={removingId === collaborator.id}
													aria-label={`Remove ${label}`}
												>
													{removingId === collaborator.id ? (
														<Loader2 className="size-4 animate-spin" />
													) : (
														<Trash2 className="size-4" />
													)}
												</Button>
											)}
										</div>
									);
								})
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
