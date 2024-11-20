export interface Service {
  id: number;
  name: string;
  type: string;
  channelId: number;
  schedule: string;
}

export interface Channel {
  id: number;
  name: string;
  enabled?: boolean;
  data: object;
}
