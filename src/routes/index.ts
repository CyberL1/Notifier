import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default (fastify: FastifyInstance) => {
  fastify.get("/", (req: FastifyRequest, reply: FastifyReply) => {
    return { appName: "Notifier" };
  });
};
