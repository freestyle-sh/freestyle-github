import type { APIRoute } from "astro";

export const GET = async ({ params, request }: Parameters<APIRoute>[0]) => {
  return new Response(`ref: refs/heads/main\n`, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
