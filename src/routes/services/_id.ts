import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { db } from "#src/prisma.ts";
import { ServiceSchema } from "#src/schemas.ts";
import type { Service } from "#src/types.ts";
import { validateSchedule } from "#src/utils/validateSchedule.ts";
import Jobs from "#src/utils/Jobs.ts";
import { CronTime } from "cron";
import Services from "#src/utils/Services.ts";

interface Params {
  id: number;
}

export default (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    async (req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
      const service = await db.service.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!service) {
        reply.code(500);

        return {
          error: "Cannot get service",
          reason: "Service ID does not match any service",
        };
      }

      return service;
    },
  );

  fastify.post(
    "/",
    { schema: { body: ServiceSchema } },
    async (req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
      const body = req.body as Service;

      const service = await db.service.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!service) {
        reply.code(500);

        return {
          error: "Cannot update service",
          reason: "Service not found",
        };
      }

      const channel = await db.channel.findUnique({
        where: { id: body.channelId },
      });

      if (!channel) {
        reply.code(500);

        return {
          error: "Cannot update service",
          reason: "Channel not found",
        };
      }

      if (!validateSchedule(body.schedule)) {
        reply.code(500);

        return {
          error: "Cannot update service",
          reason: "Cannot parse schedule",
        };
      }

      const serviceInDb = await db.service.update({
        where: { id: Number(req.params.id) },
        data: {
          name: body.name,
          type: body.type,
          channel: { connect: { id: body.channelId } },
          schedule: body.schedule,
        },
      });

      Services.remove(service.name);
      Services.add(service, true);

      Jobs.get(service.name).setTime(new CronTime(body.schedule));

      return serviceInDb;
    },
  );

  fastify.delete(
    "/",
    async (req: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
      const service = await db.service.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!service) {
        reply.code(500);

        return {
          error: "Cannot delete service",
          reason: "Service not found",
        };
      }

      Jobs.get(service.name).stop();

      await db.service.delete({ where: { id: Number(req.params.id) } });
      Jobs.remove(service.name);

      reply.code(204);
    },
  );
};
