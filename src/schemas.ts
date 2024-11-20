export const ServiceSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    channelId: {
      type: "number",
    },
    schedule: {
      type: "string",
    },
  },
  required: ["name", "channelId", "schedule"],
};

export const ChannelSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    enabled: {
      type: "boolean",
    },
    data: {
      type: "object",
    },
  },
  required: ["name"],
};
