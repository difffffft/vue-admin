declare type LoginFormType = {
  username: string;
  password: string;
};

declare interface AppRouteRecord {
  path: string;
  name: string;
  component?: () => Promise<any>;
  meta?: {
    title: string;
    keepAlive?: boolean;
    icon?: string;
    hidden?: boolean;
  };
  children?: AppRouteRecord[];
}

declare interface AppResult {
  code: number;
  data: any;
  msg: string;
}