import type { Session, User } from "next-auth";

export interface ExtendedSession extends Session {
  user: {
    id: string;
    admin: boolean;
  };
}
export interface ExtendedUser extends User {
  id: string;
  admin: boolean;
}
