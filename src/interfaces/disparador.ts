export interface GetInstances {
  data: GetInstancesData[];
}

export interface CreateInstance {
  instanceName: string;
}

export interface GetInstancesData {
  instanceName: string;
  instanceId: string;
  owner: string;
  profileName: string;
  profilePictureUrl: string;
  profileStatus: string;
  status: string;
  serverUrl: string;
  apikey: string;
  integration: Integration;
}

interface Integration {
  integration: string;
  token: string;
  webhook_wa_business: string;
}

export interface GetQrcodeInstance {
  data: GetQrcodeInstanceData;
}

export interface GetQrcodeInstanceData {
  base64: string;
}

export interface PostDataMessagesDisparar {
  type: string;
  message?: string;
  mediatype?: string;
  mimetype?: string;
  caption?: string;
  filename?: string;
  media?: string;
  dataUrl?: string;
}
