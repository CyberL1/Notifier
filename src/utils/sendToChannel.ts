import type { Channel } from "#src/types.ts";
import { debugLog } from "./debugLog.ts";

export const sendToChannel = async (channel: Channel, args: object) => {
  try {
    if (channel.enabled) {
      channel.data = args;

      (await import(`#channels/${channel.type}.ts`)).run(channel);
    }
  } catch (err) {
    debugLog(`Channel "${channel.name}" errored:`, err);
  }
};
