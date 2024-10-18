import { cloudstate, useLocal } from "freestyle-sh";
import type { ImageCS } from "./image";
import type { AuthCS } from "./auth";

@cloudstate
export class UserCS {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly avatar: ImageCS
  ) {}

  getInfo() {
    return {
      id: this.id,
      username: this.username,
      avatarUrl: this.avatar.getUrlPath(),
      isSelf: this.id === useLocal<typeof AuthCS>("auth").getCurrentUser()?.id,
    };
  }
}
