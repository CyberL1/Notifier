import type { Channel } from "#src/types.ts";

export const run = (channel: Channel) => {
  console.log(channel.data);
};
