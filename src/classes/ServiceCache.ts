import { debugLog } from "#src/utils/debugLog.ts";
import type { Channel, Service } from "#src/types.ts";
import { db } from "#src/prisma.ts";

export class ServiceCache {
  private cache: Map<string, Service & { channel?: Channel }>;

  constructor() {
    this.cache = new Map();

    debugLog("Service cache initialized");
  }

  getAll() {
    return this.cache;
  }

  get(name: string) {
    return this.cache.get(name);
  }

  async add(service: Service, withChannel?: boolean) {
    if (withChannel) {
      const channel = await db.channel.findUnique({
        where: { id: service.channelId },
      });

      // @ts-ignore
      service = { ...service, channel };
    }

    this.cache.set(service.name, service);

    debugLog(`Service "${service.name}" added to cache`);
  }

  remove(serviceName: string) {
    this.cache.delete(serviceName);

    debugLog(`Service "${serviceName}" removed from cache`);
  }
}
