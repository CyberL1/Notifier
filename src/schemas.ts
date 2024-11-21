export const ServiceSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
    type: {
      type: "string",
      minLength: 1,
    },
    channelId: {
      type: "number",
    },
    schedule: {
      type: "string",
      minLength: 1,
    },
  },
  required: ["name", "type", "channelId", "schedule"],
};

export const ChannelSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
    type: {
      type: "string",
      minLength: 1,
    },
    enabled: {
      type: "boolean",
    },
    settings: {
      type: "object",
    },
    data: {
      type: "object",
    },
  },
  required: ["name", "type"],
};
