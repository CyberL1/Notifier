import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ServiceSchema } from "#src/schemas.ts";
import type { Service } from "#src/types.ts";
import { db } from "#src/prisma.ts";
import { validateSchedule } from "#src/utils/validateSchedule.ts";
import { Job } from "#src/classes/Job.ts";
import Jobs from "#src/utils/Jobs.ts";
import { readdirSync } from "fs";

export default (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    async (req: FastifyRequest<{ Querystring: { files: boolean } }>) => {
      let services: Service[] | string[];

      if (req.query.files) {
        services = readdirSync("services").map((file) => file.slice(0, -3));
      } else {
        services = (await db.service.findMany({
          orderBy: { id: "asc" },
        })) as Service[];
      }

      return services;
    },
  );

  fastify.post(
    "/",
    { schema: { body: ServiceSchema } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const body = req.body as Service;
      const channel = await db.channel.findUnique({
        where: { id: body.channelId },
      });

      if (!channel) {
        reply.code(500);

        return {
          error: "Cannot create service",
          reason: "Channel not found",
        };
      }

      const hasChannel = await db.service.findFirst({
        where: { channel: { id: body.channelId } },
      });

      if (hasChannel) {
        reply.code(500);

        return {
          error: "Channel create service",
          reason: "Channel has a service already",
        };
      }

      if (!validateSchedule(body.schedule)) {
        reply.code(500);

        return {
          error: "Cannot create service",
          reason: "Cannot parse schedule",
        };
      }

      const serviceInDb = await db.service.create({
        data: {
          name: body.name,
          type: body.type,
          channel: { connect: { id: body.channelId } },
          schedule: body.schedule,
        },
      });

      const job = new Job(body);
      Jobs.add(job);

      job.start();

      return serviceInDb;
    },
  );
};
