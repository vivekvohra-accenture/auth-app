export type Role = "ADMIN" | "USER";

export interface UserDb {
  id?: number | string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  role: Role;
}

export interface SessionUser {
  id?: number | string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: Role;
}