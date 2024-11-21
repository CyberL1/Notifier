import type { Channel } from "#src/types.ts";
import mustache from "mustache";
import { debugLog } from "./debugLog.ts";

export const sendToChannel = async (channel: Channel, args: object) => {
  try {
    if (channel.enabled) {
      let data = { ...channel.data };

      data = JSON.parse(mustache.render(JSON.stringify(data), args));

      (await import(`#channels/${channel.type}.ts`)).run({ ...channel, data });
    }
  } catch (err) {
    debugLog(`Channel "${channel.name}" errored:`, err);
  }
};
