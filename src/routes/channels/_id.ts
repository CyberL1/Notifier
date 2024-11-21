import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { db } from "#src/prisma.ts";
import { ChannelSchema } from "#src/schemas.ts";
import type { Channel } from "#src/types.ts";
import Services from "#src/utils/Services.ts";

interface Params {
  id: number;
}

export default (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    async (req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
      const channel = await db.channel.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!channel) {
        reply.code(500);

        return {
          error: "Cannot get channel",
          reason: "Channel ID does not match any channel",
        };
      }

      return channel;
    },
  );

  fastify.post(
    "/",
    { schema: { body: ChannelSchema } },
    async (req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
      const body = req.body as Channel;

      const channel = await db.channel.findUnique({
        where: { id: Number(req.params.id) },
        include: { Service: true },
      });

      if (!channel) {
        reply.code(500);

        return {
          error: "Cannot update channel",
          reason: "Channel not found",
        };
      }

      const channelInDb = await db.channel.update({
        where: { id: Number(req.params.id) },
        data: {
          name: body.name,
          type: body.type,
          enabled: body.enabled,
          data: body.data,
        },
      });

      Services.remove(channel.Service[0].name);
      Services.add(channel.Service[0], true);

      return channelInDb;
    },
  );

  fastify.delete(
    "/",
    async (req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
      const channel = await db.channel.findUnique({
        where: { id: Number(req.params.id) },
        include: { Service: true },
      });

      if (!channel) {
        reply.code(500);

        return { error: "Cannot delete channel", reason: "Channel not found" };
      }

      if (channel.Service.length) {
        reply.code(500);

        return {
          error: "Cannot delete channel",
          reason: "There's a service tied with channel",
        };
      }

      await db.channel.delete({ where: { id: Number(req.params.id) } });

      reply.code(204);
    },
  );
};
