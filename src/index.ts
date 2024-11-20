import Fastify from "fastify";
import { readdirSync } from "fs";

const fastify = Fastify();

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

try {
  fastify.listen({ port: Number(process.env.PORT) });
  console.log("App ready on", process.env.PORT);
} catch (err) {
  console.error(err);
}
