import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch }) => {
  const UPSTREAM_URL = env.UPSTREAM_ADS_TXT_URL;

  if (!UPSTREAM_URL) {
    return new Response(null, {
      status: 204,
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  const res = await fetch(UPSTREAM_URL);

  if (!res.ok) {
    throw error(502, `Failed to fetch ads.txt: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();

  return new Response(text, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=900",
    },
  });
};
