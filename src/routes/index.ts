import type { FastifyInstance } from "fastify";
import { db } from "#src/prisma.ts";

export default (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    const services = await db.service.count();
    const channels = await db.channel.count();

    return { appName: "Notifier", stats: { services, channels } };
  });
};
