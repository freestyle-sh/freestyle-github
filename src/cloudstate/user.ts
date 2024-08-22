import { cloudstate } from "freestyle-sh";
import type { ImageCS } from "./image";

@cloudstate
export class UserCS {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly avatar: ImageCS,
  ) {}

  getInfo() {
    return {
      id: this.id,
      username: this.username,
      avatarUrl: this.avatar.getUrlPath(),
    };
  }
}
