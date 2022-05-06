export interface ResponseData<T> {
  code: number;
  data: T;
  msg: string;
}

export interface User {
  userName: string;
  account: string;
  uuid: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
export interface MovieInfo {
  uuid: string;
  name: string;
  type?: string;
  actors?: string;
  director?: string;
  time?: string;
  imgUrl: string;
  videoUrl?: string;
  isHot?: boolean;
  createdAt?: string;
  updatedAt?: string;
  desc?: string;
  videoType?: 'mv' | 'common'
}
