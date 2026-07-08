import { redirect, type LoaderFunctionArgs } from "react-router";

export function loader({ request, params }: LoaderFunctionArgs) {
  const gameSlug = params.gameSlug;
  const matchId = params.matchId;
  const url = new URL(request.url);
  const gameId = url.searchParams.get("gameId");

  if (gameSlug === "gundam" && matchId && gameId) {
    const search = new URLSearchParams(url.searchParams);
    search.delete("gameId");
    const query = search.toString();
    const target = `/gundam/simulator/matches/${encodeURIComponent(
      matchId,
    )}/games/${encodeURIComponent(gameId)}${query ? `?${query}` : ""}`;
    throw redirect(target);
  }

  if (gameSlug === "gundam" && matchId) {
    const query = url.searchParams.toString();
    throw redirect(
      `/gundam/simulator/matches/${encodeURIComponent(matchId)}${query ? `?${query}` : ""}`,
    );
  }

  throw redirect("/");
}

export default function LegacyGundamMatchRoute() {
  return null;
}
