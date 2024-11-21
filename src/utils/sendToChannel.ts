import type { Channel } from "#src/types.ts";
import { debugLog } from "./debugLog.ts";

export const sendToChannel = async (channel: Channel, args: object) => {
  try {
    if (channel.enabled) {
      const dataStrigified = JSON.stringify(channel.data).replace(
        /{{(.+)}}/g,
        (_$1, $2) => args[$2],
      );

      channel.data = JSON.parse(dataStrigified);

      (await import(`#channels/${channel.type}.ts`)).run(channel);
    }
  } catch (err) {
    debugLog(`Channel "${channel.name}" errored:`, err);
  }
};
