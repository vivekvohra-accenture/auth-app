export type Role = "ADMIN" | "USER";

export interface UserDb {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  role: Role;
}

export interface SessionUser {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: Role;
}