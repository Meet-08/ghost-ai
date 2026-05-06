import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "./generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL environment variable is not set");
}

const prismaDatabaseUrl = databaseUrl;

function createPrismaClient() {
	if (prismaDatabaseUrl.startsWith("prisma+postgres://")) {
		return new PrismaClient({
			accelerateUrl: prismaDatabaseUrl,
		}).$extends(withAccelerate());
	}

	const adapter = new PrismaPg({
		connectionString: prismaDatabaseUrl,
	});

	return new PrismaClient({ adapter });
}

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

declare global {
	var __prisma: PrismaClientSingleton | undefined;
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalThis.__prisma = prisma;
}
