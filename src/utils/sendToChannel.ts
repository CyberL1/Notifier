import type { Channel } from "#src/types.ts";
import { debugLog } from "./debugLog.ts";

export const sendToChannel = async (channel: Channel, args: object) => {
  try {
    if (channel.enabled) {
      const data = { ...channel.data };

      const replacePlaceholders = (data: any, args: object) => {
        for (const key of Object.keys(data)) {
          if (typeof data[key] === "string") {
            data[key] = data[key].replace(
              /{{(.+?)}}/g,
              ($1: string, $2: string) => args[$2] ?? $1,
            );
          } else if (typeof data[key] === "object" && data[key]) {
            data[key] = replacePlaceholders(data[key], args);
          }
        }

        return data;
      };

      replacePlaceholders(data, args);

      (await import(`#channels/${channel.type}.ts`)).run({ ...channel, data });
    }
  } catch (err) {
    debugLog(`Channel "${channel.name}" errored:`, err);
  }
};
