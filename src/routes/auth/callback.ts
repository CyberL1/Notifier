import { AuthSchema } from "#src/schemas.ts";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default (fastify: FastifyInstance) => {
  fastify.post(
    "/",
    { schema: { body: AuthSchema } },
    (
      req: FastifyRequest<{ Body: { password: string } }>,
      reply: FastifyReply,
    ) => {
      if (req.body.password != process.env.PASSWORD) {
        reply.code(500);

        return {
          error: "Not logged in",
          reason: "Wrong password",
        };
      }

      return { success: true };
    },
  );
};
