export interface IServerConfig {
  port: number;
  graphqlPlayGround: boolean;
  httpsEnabled: boolean;
  certsPath: string;
}

export interface IBGAPIConfig {
  host: string;
  clientId: string;
  aemHost?: string;
}

export interface ILHAPIConfig {
  host: string;
  partnerId: string;
  privateKeyParameterId: string;
}

export interface IAWSConfig {
  endpoint?: string;
  region: string;
}

export interface ILogsConfig {
  level: string;
  silent: boolean;
  pushToFile: boolean;
}

export interface IAppDynamicsConfig {
  accountName: string;
  hostName: string;
  accountKey: string;
  appName: string;
  enabled: boolean;
  nodeName: string;
}
