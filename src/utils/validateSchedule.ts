import { CronJob } from "cron";

export const validateSchedule = (schedule: string) => {
  if (!schedule) {
    return false;
  }

  try {
    new CronJob(schedule, () => {
      console.log("Valid");
    });
  } catch {
    return false;
  }

  return true;
};
