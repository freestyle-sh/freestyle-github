import { cloudstate } from "freestyle-sh";
import {
  type BaseUserCS,
  type FinishPasskeyRegistrationJSON,
  PasskeyAuthentication,
} from "freestyle-auth/passkey";
import { UserCS } from "./user";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";
import { ImageCS } from "./image";

@cloudstate
export class AuthCS extends PasskeyAuthentication {
  static readonly id = "auth";

  usersById = new Map<string, UserCS>();

  get rpid() {
    return import.meta.env.DEV ? "localhost" : import.meta.env.FREESTYLE_DOMAIN;
  }
  get origin() {
    return import.meta.env.DEV
      ? "http://localhost:8910"
      : `https://${this.rpid}`;
  }

  override async finishRegistration(passkey: FinishPasskeyRegistrationJSON) {
    const info = await super.finishRegistration(passkey);
    const avatar = createAvatar(identicon);
    const avatarBlob = new Blob([avatar.toJson().svg], {
      type: "image/svg+xml",
    });
    const user = new UserCS(info.id, info.username, new ImageCS(avatarBlob));
    this.usersById.set(info.id, user);
    return {
      id: user.id,
      username: user.username,
    };
  }

  override getCurrentUser() {
    const info = super.getCurrentUser();
    if (!info) {
      return;
    }
    return Array.from(this.usersById.values()).find((user) =>
      user.id === info.id
    );
  }

  override getDefiniteCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error("No user logged in");
    }
    return user;
  }

  getUserInfo() {
    return this.getCurrentUser()?.getInfo();
  }
}
