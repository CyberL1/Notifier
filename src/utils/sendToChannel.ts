import type { Channel } from "#src/types.ts";
import { debugLog } from "./debugLog.ts";

export const sendToChannel = async (channel: Channel, args: object) => {
  try {
    if (channel.enabled) {
      const data = { ...channel.data };

      for (const key of Object.keys(data)) {
        data[key] = data[key].replace(
          /{{(.+?)}}/g,
          ($1: string, $2: string) => args[$2] ?? $1,
        );
      }

      (await import(`#channels/${channel.type}.ts`)).run({ ...channel, data });
    }
  } catch (err) {
    debugLog(`Channel "${channel.name}" errored:`, err);
  }
};
