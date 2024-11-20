import type { CronJob } from "cron";
import { debugLog } from "#src/utils/debugLog.ts";
import { Job } from "./Job.ts";

export class JobCache {
  private cache: Map<string, CronJob>;

  constructor() {
    this.cache = new Map();

    debugLog("Job cache initialized");
  }

  getAll() {
    return this.cache;
  }

  get(name: string) {
    return this.cache.get(name);
  }

  add(job: Job) {
    this.cache.set(job.service.name, job.job);

    debugLog(`Job for "${job.service.name}" added to job cache`);
  }

  remove(serviceName: string) {
    this.cache.delete(serviceName);

    debugLog(`Job for "${serviceName}" removed from job cache`);
  }
}
