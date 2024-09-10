export enum BasicStatus {
  DISABLE,
  ENABLE,
}
export enum PermissionType {
  CATALOGUE,
  MENU,
  BUTTON,
}

export interface UserToken {
  accessToken?: string;
  refreshToken?: string;
}

export interface Permission {
  id: string;
  parentId: string;
  name: string;
  label: string;
  type: PermissionType;
  route: string;
  status?: BasicStatus;
  order?: number;
  icon?: string;
  component?: string;
  hide?: boolean;
  hideTab?: boolean;
  frameSrc?: string;
  newFeature?: boolean;
  children?: Permission[];
}
