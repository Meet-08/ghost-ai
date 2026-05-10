const PALETTE = [
	"#ef4444",
	"#f97316",
	"#f59e0b",
	"#eab308",
	"#84cc16",
	"#10b981",
	"#06b6d4",
	"#3b82f6",
	"#6366f1",
	"#a78bfa",
	"#ec4899",
	"#f43f5e",
];

function hashStringToNumber(s: string) {
	let h = 0;
	for (let i = 0; i < s.length; i++) {
		h = (h << 5) - h + s.charCodeAt(i);
		h |= 0;
	}
	return Math.abs(h);
}

export function colorForUserId(userId: string) {
	const idx = hashStringToNumber(userId) % PALETTE.length;
	return PALETTE[idx];
}

function liveblocksSecret() {
	const s = process.env.LIVEBLOCKS_SECRET;
	if (!s) throw new Error("LIVEBLOCKS_SECRET is not set");
	return s;
}

export function liveblocksSecretKey() {
	return liveblocksSecret();
}

export default {
	colorForUserId,
	liveblocksSecretKey,
};
