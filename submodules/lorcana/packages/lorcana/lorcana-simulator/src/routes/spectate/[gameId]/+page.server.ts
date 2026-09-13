import { error, redirect, type ServerLoadEvent } from "@sveltejs/kit";
import { base } from "$app/paths";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { getServerApiOrigin } from "$lib/server/fetch-with-cf.js";
import { serverJsonOrNull } from "$lib/data/server/server-json.js";

export async function load({ params, request, url }: ServerLoadEvent): Promise<never> {
  const gameId = params.gameId as string;
  const api = getServerApiOrigin(getApiOrigin());
  const cookie = request.headers.get("cookie") ?? "";
  const resolution = await serverJsonOrNull<{ path: string }>(
    `${api}/v1/games/lorcana/play/matches/resolve/${encodeURIComponent(gameId)}`,
    { headers: { Accept: "application/json", ...(cookie ? { cookie } : {}) } },
  );
  if (!resolution) error(404, "Match not found");
  const resolutionPath = resolution.path.startsWith("/") ? resolution.path : `/${resolution.path}`;
  const target = new URL(`${base}${resolutionPath}`, url.origin);
  const returnTo = url.searchParams.get("returnTo");
  if (returnTo) target.searchParams.set("returnTo", returnTo);
  redirect(303, `${target.pathname}${target.search}`);
}
