export interface Service {
  id: number;
  name: string;
  type: string;
  channelId: number;
  channel?: Channel;
  schedule: string;
}

export interface Channel {
  id: number;
  name: string;
  enabled?: boolean;
  data: object;
}
