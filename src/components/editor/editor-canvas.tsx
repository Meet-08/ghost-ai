import { Button } from "#/components/ui/button.tsx";
import {
	CANVAS_NODE_TYPE,
	NODE_COLORS,
	type CanvasNode,
	type CanvasNodeShape,
} from "#/types/canvas";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import "@liveblocks/react-flow/styles.css";
import "@liveblocks/react-ui/styles.css";
import {
	ClientSideSuspense,
	LiveblocksProvider,
	RoomProvider,
} from "@liveblocks/react/suspense";
import {
	Background,
	BackgroundVariant,
	ConnectionMode,
	Handle,
	MiniMap,
	Position,
	ReactFlow,
	ReactFlowProvider,
	useReactFlow,
	type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
	Component,
	memo,
	useCallback,
	type DragEvent,
	type ReactNode,
} from "react";

interface EditorCanvasProps {
	roomId: string;
}

interface CanvasState {
	hasError: boolean;
	errorMessage: string | null;
}

interface CanvasShapeDragPayload {
	shape: CanvasNodeShape;
	defaultSize: {
		width: number;
		height: number;
	};
}

interface CanvasShapePreset {
	shape: CanvasNodeShape;
	label: string;
	width: number;
	height: number;
}

const DEFAULT_CANVAS_NODE_COLOR = NODE_COLORS[0];
const SHAPE_DRAG_MIME = "application/x-ghost-ai-canvas-shape";

let canvasNodeIdCounter = 0;

const CANVAS_SHAPE_PRESETS: CanvasShapePreset[] = [
	{ shape: "rectangle", label: "Rectangle", width: 164, height: 96 },
	{ shape: "diamond", label: "Diamond", width: 152, height: 152 },
	{ shape: "circle", label: "Circle", width: 120, height: 120 },
	{ shape: "pill", label: "Pill", width: 172, height: 72 },
	{ shape: "cylinder", label: "Cylinder", width: 156, height: 104 },
	{ shape: "hexagon", label: "Hexagon", width: 160, height: 112 },
];

function readShapeDragPayload(
	event: DragEvent<HTMLDivElement>,
): CanvasShapeDragPayload | null {
	const rawPayload = event.dataTransfer.getData(SHAPE_DRAG_MIME);

	if (!rawPayload) {
		return null;
	}

	try {
		const parsedPayload = JSON.parse(rawPayload) as CanvasShapeDragPayload;

		if (
			typeof parsedPayload.shape !== "string" ||
			typeof parsedPayload.defaultSize?.width !== "number" ||
			typeof parsedPayload.defaultSize?.height !== "number"
		) {
			return null;
		}

		return parsedPayload;
	} catch {
		return null;
	}
}

function CanvasShapeGlyph({ shape }: { shape: CanvasNodeShape }) {
	switch (shape) {
		case "rectangle":
			return (
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect
						x="4"
						y="6"
						width="16"
						height="12"
						rx="2.5"
						stroke="currentColor"
						strokeWidth="1.8"
					/>
				</svg>
			);
		case "diamond":
			return (
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<polygon
						points="12 3 21 12 12 21 3 12"
						stroke="currentColor"
						strokeWidth="1.8"
						fill="none"
					/>
				</svg>
			);
		case "circle":
			return (
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle
						cx="12"
						cy="12"
						r="8"
						stroke="currentColor"
						strokeWidth="1.8"
					/>
				</svg>
			);
		case "pill":
			return (
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect
						x="4"
						y="7"
						width="16"
						height="10"
						rx="5"
						stroke="currentColor"
						strokeWidth="1.8"
					/>
				</svg>
			);
		case "cylinder":
			return (
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<ellipse
						cx="12"
						cy="6.5"
						rx="8"
						ry="3"
						stroke="currentColor"
						strokeWidth="1.8"
					/>
					<path
						d="M4 6.5v10c0 1.7 3.6 3 8 3s8-1.3 8-3v-10"
						stroke="currentColor"
						strokeWidth="1.8"
						fill="none"
					/>
					<path
						d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"
						stroke="currentColor"
						strokeWidth="1.8"
						fill="none"
					/>
				</svg>
			);
		case "hexagon":
			return (
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<polygon
						points="8 4 16 4 20 12 16 20 8 20 4 12"
						stroke="currentColor"
						strokeWidth="1.8"
						fill="none"
					/>
				</svg>
			);
	}
}

function CanvasShapeButton({ preset }: { preset: CanvasShapePreset }) {
	const handleDragStart = useCallback(
		(event: DragEvent<HTMLButtonElement>) => {
			const payload: CanvasShapeDragPayload = {
				shape: preset.shape,
				defaultSize: {
					width: preset.width,
					height: preset.height,
				},
			};

			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.setData(SHAPE_DRAG_MIME, JSON.stringify(payload));
		},
		[preset.height, preset.shape, preset.width],
	);

	return (
		<button
			type="button"
			draggable
			title={preset.label}
			aria-label={`Drag ${preset.label.toLowerCase()} onto the canvas`}
			className="flex size-10 items-center justify-center rounded-full border border-surface-border bg-subtle text-copy-secondary transition hover:border-surface-border hover:bg-elevated hover:text-copy-primary"
			onDragStart={handleDragStart}
		>
			<span className="size-4">
				<CanvasShapeGlyph shape={preset.shape} />
			</span>
		</button>
	);
}

function ShapePanel() {
	return (
		<div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-6">
			<div className="flex items-center gap-1 rounded-full border border-surface-border bg-surface/95 p-2 shadow-2xl backdrop-blur">
				{CANVAS_SHAPE_PRESETS.map((preset) => (
					<CanvasShapeButton key={preset.shape} preset={preset} />
				))}
			</div>
		</div>
	);
}

const CanvasNodeRenderer = memo(function CanvasNodeRenderer({
	data,
	selected,
}: NodeProps<CanvasNode>) {
	const textColor =
		NODE_COLORS.find((color) => color.fill === data.color)?.text ??
		DEFAULT_CANVAS_NODE_COLOR.text;

	return (
		<div
			className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-surface-border px-4 py-3 text-center shadow-lg"
			style={{ backgroundColor: data.color, color: textColor }}
			data-selected={selected ? "true" : "false"}
			title={data.shape}
		>
			<Handle
				type="target"
				position={Position.Top}
				className="size-2 border border-surface-border opacity-0 transition-opacity group-hover:opacity-100"
				style={{ backgroundColor: "var(--text-primary)" }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="size-2 border border-surface-border opacity-0 transition-opacity group-hover:opacity-100"
				style={{ backgroundColor: "var(--text-primary)" }}
			/>
			<Handle
				type="target"
				position={Position.Left}
				className="size-2 border border-surface-border opacity-0 transition-opacity group-hover:opacity-100"
				style={{ backgroundColor: "var(--text-primary)" }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				className="size-2 border border-surface-border opacity-0 transition-opacity group-hover:opacity-100"
				style={{ backgroundColor: "var(--text-primary)" }}
			/>
			<span className="truncate text-sm font-medium leading-none">
				{data.label}
			</span>
		</div>
	);
});

const CANVAS_NODE_TYPES = {
	[CANVAS_NODE_TYPE]: CanvasNodeRenderer,
};

class CanvasErrorBoundary extends Component<
	{ children: ReactNode },
	CanvasState
> {
	state: CanvasState = {
		hasError: false,
		errorMessage: null,
	};

	static getDerivedStateFromError(error: Error): CanvasState {
		return {
			hasError: true,
			errorMessage: error.message,
		};
	}

	override render() {
		if (this.state.hasError) {
			return <CanvasErrorFallback errorMessage={this.state.errorMessage} />;
		}

		return this.props.children;
	}
}

function CanvasErrorFallback({
	errorMessage,
}: {
	errorMessage: string | null;
}) {
	return (
		<div className="flex h-full w-full items-center justify-center bg-base px-6 text-center">
			<div className="max-w-md rounded-3xl border border-surface-border bg-surface px-8 py-10 shadow-2xl">
				<p className="text-sm font-medium uppercase tracking-[0.24em] text-copy-muted">
					Liveblocks error
				</p>
				<h2 className="mt-3 text-2xl font-semibold tracking-tight text-copy-primary">
					Canvas unavailable
				</h2>
				<p className="mt-3 text-sm leading-6 text-copy-secondary">
					The collaborative canvas could not connect to the room. Reload the
					page to try again.
				</p>
				{errorMessage ? (
					<p className="mt-4 rounded-2xl border border-surface-border bg-subtle px-4 py-3 font-mono text-xs leading-5 text-copy-muted">
						{errorMessage}
					</p>
				) : null}
				<Button
					type="button"
					className="mt-6"
					onClick={() => window.location.reload()}
				>
					Reload canvas
				</Button>
			</div>
		</div>
	);
}

function CanvasLoadingState() {
	return (
		<div className="flex h-full w-full items-center justify-center bg-base px-6 text-center">
			<div className="max-w-sm rounded-3xl border border-surface-border bg-surface px-8 py-10 shadow-2xl">
				<p className="text-sm font-medium uppercase tracking-[0.24em] text-copy-muted">
					Loading room
				</p>
				<h2 className="mt-3 text-2xl font-semibold tracking-tight text-copy-primary">
					Preparing collaborative canvas
				</h2>
				<p className="mt-3 text-sm leading-6 text-copy-secondary">
					Syncing the Liveblocks room and flow state.
				</p>
			</div>
		</div>
	);
}

function CanvasFlow() {
	const { addNodes, screenToFlowPosition } = useReactFlow();
	const { nodes, edges, onConnect, onDelete, onEdgesChange, onNodesChange } =
		useLiveblocksFlow<CanvasNode>({
			suspense: true,
			nodes: {
				initial: [],
			},
			edges: {
				initial: [],
			},
		});

	const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const handleDrop = useCallback(
		(event: DragEvent<HTMLDivElement>) => {
			event.preventDefault();

			const draggedShape = readShapeDragPayload(event);

			if (!draggedShape) {
				return;
			}

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});

			const timestamp = Date.now();
			const counter = ++canvasNodeIdCounter;

			addNodes({
				id: `${draggedShape.shape}-${timestamp}-${counter}`,
				type: CANVAS_NODE_TYPE,
				position,
				style: {
					width: draggedShape.defaultSize.width,
					height: draggedShape.defaultSize.height,
				},
				data: {
					label: "",
					color: DEFAULT_CANVAS_NODE_COLOR.fill,
					shape: draggedShape.shape,
				},
			});
		},
		[addNodes, screenToFlowPosition],
	);

	return (
		<div className="relative h-full w-full overflow-hidden bg-base">
			<ReactFlow
				className="bg-base"
				nodes={nodes}
				edges={edges}
				onConnect={onConnect}
				onDelete={onDelete}
				onEdgesChange={onEdgesChange}
				onNodesChange={onNodesChange}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				nodeTypes={CANVAS_NODE_TYPES}
				connectionMode={ConnectionMode.Loose}
				fitView
			>
				<MiniMap
					nodeColor="var(--accent-primary)"
					nodeStrokeColor="var(--border-default)"
					maskColor="var(--bg-base)"
					className="rounded-2xl! border! border-surface-border! bg-surface! shadow-xl!"
				/>
				<Background
					variant={BackgroundVariant.Dots}
					gap={20}
					size={1}
					color="var(--border-default)"
					className="bg-base"
				/>
			</ReactFlow>
			<ShapePanel />
		</div>
	);
}

export function EditorCanvas({ roomId }: EditorCanvasProps) {
	return (
		<div className="relative h-full w-full overflow-hidden bg-base">
			<CanvasErrorBoundary key={roomId}>
				<LiveblocksProvider authEndpoint="/api/liveblocks-auth">
					<RoomProvider
						id={roomId}
						initialPresence={{ cursor: null, isThinking: false }}
					>
						<ReactFlowProvider>
							<ClientSideSuspense fallback={<CanvasLoadingState />}>
								<CanvasFlow />
							</ClientSideSuspense>
						</ReactFlowProvider>
					</RoomProvider>
				</LiveblocksProvider>
			</CanvasErrorBoundary>
		</div>
	);
}
