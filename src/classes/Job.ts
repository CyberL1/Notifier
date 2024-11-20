import type { Service } from "#src/types.ts";
import { debugLog } from "#src/utils/debugLog.ts";
import { CronJob, CronTime } from "cron";

export class Job {
  id: string;
  service: Service;
  job: CronJob;

  constructor(service: Service) {
    this.service = service;
    this.job = new CronJob(this.service.schedule, () => {
      console.log(
        `Job for "${this.service.name}" service executed at ${new Date().toTimeString()}`,
      );
    });

    debugLog(`Job for service "${this.service.name}" created`);
  }

  start() {
    debugLog(`Starting job for service "${this.service.name}"`);
    this.job.start();
  }

  stop() {
    debugLog(`Stopping job for service "${this.service.name}"`);
    this.job.stop();
  }

  setTime(schedule: string) {
    this.job.setTime(new CronTime(schedule));
    debugLog(`Cron time updated for "${this.service.name}"`);
  }
}
