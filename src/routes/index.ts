import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { db } from "#src/prisma.ts";

export default (fastify: FastifyInstance) => {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const services = await db.service.count();
    const channels = await db.channel.count();

    return { appName: "Notifier", stats: { services, channels } };
  });
};
