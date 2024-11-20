import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ChannelSchema } from "#src/schemas.ts";
import type { Channel } from "#src/types.ts";
import { db } from "#src/prisma.ts";

export default (fastify: FastifyInstance) => {
  fastify.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
    const channels = await db.channel.findMany();

    return channels;
  });

  fastify.post(
    "/",
    { schema: { body: ChannelSchema } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const body = req.body as Channel;

      const channelInDb = await db.channel.create({
        data: {
          name: body.name,
          enabled: body.enabled,
          data: body.data,
        },
      });

      return channelInDb;
    },
  );
};
