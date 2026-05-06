import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog.tsx";
import type React from "react";

/**
 * Dialog configuration type for creating consistent dialogs across the application
 */
export interface DialogConfig {
	title: string;
	description?: string;
	footer?: React.ReactNode;
	children?: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	showCloseButton?: boolean;
}

/**
 * Base dialog pattern component that accepts title, description, and footer actions
 *
 * @example
 * ```tsx
 * <DialogPattern
 *   title="Create New Project"
 *   description="Enter project details below"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   footer={
 *     <>
 *       <Button variant="outline">Cancel</Button>
 *       <Button>Create</Button>
 *     </>
 *   }
 * >
 *   <input type="text" placeholder="Project name" />
 * </DialogPattern>
 * ```
 */
export function DialogPattern({
	title,
	description,
	footer,
	children,
	open,
	onOpenChange,
	showCloseButton = true,
}: DialogConfig) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={showCloseButton}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>

				{children && <div className="py-4">{children}</div>}

				{footer && <DialogFooter>{footer}</DialogFooter>}
			</DialogContent>
		</Dialog>
	);
}

export {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog.tsx";
