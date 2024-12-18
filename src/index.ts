import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { readdirSync } from "fs";
import { db } from "./prisma.ts";
import Jobs from "./utils/Jobs.ts";
import { Job } from "./classes/Job.ts";
import Services from "./utils/Services.ts";

const fastify = Fastify();

fastify.register(cors);

process.env.PORT ??= "3000";

const routesDir = readdirSync(`${import.meta.dirname}/routes`, {
  recursive: true,
});

for (let file of routesDir) {
  if (typeof file === "string") {
    if (!file.endsWith(".ts")) {
      continue;
    }

    file = file.replaceAll("\\", "/");

    let route = `/${file.split(".").slice(0, -1).join(".")}`;
    route = route.replaceAll("_", ":");

    const routePath = route.endsWith("/index") ? route.slice(0, -6) : route;

    console.log(`Loading route: ${routePath}`);
    fastify.register((await import(`./routes/${file}`)).default, {
      prefix: routePath,
    });
  }
}

if (process.env.PASSWORD) {
  fastify.addHook(
    "onRequest",
    (req: FastifyRequest, reply: FastifyReply, done) => {
      if (req.url === "/auth/callback") {
        return done();
      }

      if (!req.headers.authorization) {
        reply.code(401);

        reply.send({
          error: "Cannot access resource",
          reason: "Unauthorized",
        });
      } else if (req.headers.authorization != process.env.PASSWORD) {
        reply.code(403);

        reply.send({
          error: "Cannot access resource",
          reason: "Forbidden",
        });
      }

      done();
    },
  );
}

try {
  fastify.listen({ port: Number(process.env.PORT) });
  console.log("App ready on", process.env.PORT);

  // Create service jobs
  const services = await db.service.findMany();

  for (const service of services) {
    Services.add(service, true);

    const job = new Job(service);

    Jobs.add(job);
    job.start();
  }
} catch (err) {
  console.error(err);
}
