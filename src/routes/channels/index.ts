import type { FastifyInstance, FastifyRequest } from "fastify";
import { ChannelSchema } from "#src/schemas.ts";
import type { Channel } from "#src/types.ts";
import { db } from "#src/prisma.ts";

export default (fastify: FastifyInstance) => {
  fastify.get("/", async () => {
    const channels = await db.channel.findMany();

    return channels;
  });

  fastify.post(
    "/",
    { schema: { body: ChannelSchema } },
    async (req: FastifyRequest) => {
      const body = req.body as Channel;

      const channelInDb = await db.channel.create({
        data: {
          name: body.name,
          type: body.type,
          enabled: body.enabled,
          settings: body.settings,
          data: body.data,
        },
      });

      return channelInDb;
    },
  );
};
