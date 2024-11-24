import type { Channel } from "#src/types.ts";

interface Settings {
  webhookUrl: string;
}

interface Data {
  content: string;
}

export const run = async (channel: Channel) => {
  const settings = channel.settings as Settings;
  const data = channel.data as Data;

  if (!settings.webhookUrl) {
    return console.error("webhook url not configured");
  }

  await fetch(settings.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
