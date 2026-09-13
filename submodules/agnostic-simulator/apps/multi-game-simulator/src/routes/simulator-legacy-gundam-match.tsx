import { redirect, type LoaderFunctionArgs } from "react-router";

export function loader({ request, params }: LoaderFunctionArgs) {
  const gameSlug = params.gameSlug;
  const matchId = params.matchId;
  const url = new URL(request.url);
  const gameId = url.searchParams.get("gameId");
  const search = sanitizedNavigationParams(url.searchParams);

  if (gameSlug === "gundam" && matchId && gameId) {
    search.delete("gameId");
    const query = search.toString();
    const target = `/gundam/simulator/matches/${encodeURIComponent(
      matchId,
    )}/games/${encodeURIComponent(gameId)}${query ? `?${query}` : ""}`;
    throw redirect(target);
  }

  if (gameSlug === "gundam" && matchId) {
    const query = search.toString();
    throw redirect(
      `/gundam/simulator/matches/${encodeURIComponent(matchId)}${query ? `?${query}` : ""}`,
    );
  }

  throw redirect("/");
}

function sanitizedNavigationParams(params: URLSearchParams): URLSearchParams {
  const result = new URLSearchParams(params);
  for (const key of ["playerId", "role", "spectate", "ticket", "authToken"]) {
    result.delete(key);
  }
  return result;
}

export default function LegacyGundamMatchRoute() {
  return null;
}
