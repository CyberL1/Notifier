import type { Service } from "#src/types.ts";
import { sendToChannel } from "#src/utils/sendToChannel.ts";

export const run = (service: Service) => {
  sendToChannel(service.channel, { now: Date.now() });
};
