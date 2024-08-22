import { cloudstate } from "freestyle-sh";

@cloudstate
export class ImageCS {
  id = crypto.randomUUID();
  blob: Blob;

  constructor(blob: Blob) {
    this.blob = blob;
  }

  async fetch(_request: Request) {
    return new Response(await this.blob.arrayBuffer(), {
      headers: {
        "Content-Type": this.blob.type,
        "Content-Length": this.blob.size.toString(),
      },
    });
  }

  getUrlPath() {
    return `/cloudstate/instances/${this.id}`;
  }
}
