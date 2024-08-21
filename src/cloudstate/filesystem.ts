import { cloudstate } from "freestyle-sh";
import { type Store, Transaction, type Ino, StoreFS } from "@zenfs/core";

export function createFS() {
  return new StoreFS(new CloudStore());
}

export class CloudStoreTransaction extends Transaction<CloudStore> {
  pending = new Map<Ino, Uint8Array>();

  async get(ino: Ino): Promise<Uint8Array> {
    return this.getSync(ino);
  }

  getSync(ino: Ino): Uint8Array {
    return this.pending.get(ino) ?? new Uint8Array();
  }

  async set(ino: Ino, data: Uint8Array): Promise<void> {
    this.setSync(ino, data);
  }

  setSync(ino: Ino, data: Uint8Array): void {
    this.pending.set(ino, data);
  }

  async remove(ino: Ino): Promise<void> {
    this.removeSync(ino);
  }

  removeSync(ino: Ino): void {
    this.pending.delete(ino);
  }

  async commit(): Promise<void> {
    this.commitSync();
  }

  commitSync(): void {
    this.store.data = new Map(this.pending.entries());
    this.pending = new Map();
  }

  async abort(): Promise<void> {
    this.abortSync();
  }

  abortSync(): void {
    this.pending = new Map();
  }

  async [Symbol.asyncDispose](): Promise<void> {
    this.pending.clear();
  }
  [Symbol.dispose](): void {
    this.pending.clear();
  }
}

@cloudstate
export class CloudStore implements Store {
  name = "CloudStore";
  data = new Map<Ino, Uint8Array>();

  async sync(): Promise<void> {}

  async clear(): Promise<void> {
    this.clearSync();
  }

  clearSync(): void {
    this.data = new Map<Ino, Uint8Array>();
  }

  transaction(): Transaction {
    return new CloudStoreTransaction(this);
  }
}
