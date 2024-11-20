import type { Service } from "#src/types.ts";
import { debugLog } from "#src/utils/debugLog.ts";
import Services from "#src/utils/Services.ts";
import { CronJob, CronTime } from "cron";

export class Job {
  id: string;
  service: Service;
  job: CronJob;

  constructor(service: Service) {
    this.service = service;

    this.job = new CronJob(service.schedule, async () => {
      service = Services.get(this.service.name);

      if (!service.channel.enabled) {
        return debugLog(`Channel for service "${service.name}" disabled`);
      }

      try {
        (await import(`#services/${service.name}.ts`)).run(
          service.channel.data,
        );
      } catch (err) {
        console.error(`Job for "${service.name}" errored:`, err);
      }
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
