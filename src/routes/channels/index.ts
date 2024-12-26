import type { FastifyInstance, FastifyRequest } from "fastify";
import { ChannelSchema } from "#src/schemas.ts";
import type { Channel } from "#src/types.ts";
import { db } from "#src/prisma.ts";
import { readdirSync } from "fs";

export default (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    async (req: FastifyRequest<{ Querystring: { files: boolean } }>) => {
      let channels: Channel[] | string[];

      if (req.query.files) {
        channels = readdirSync("channels").map((file) => file.slice(0, -3));
      } else {
        channels = (await db.channel.findMany({
          orderBy: { id: "asc" },
        })) as Channel[];
      }

      return channels;
    },
  );

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
