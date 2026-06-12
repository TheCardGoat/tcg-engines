export const ssr = false;

export function load({ params, url }: { params: { gameId: string }; url: URL }) {
  const step = Number(url.searchParams.get("step") ?? "0");
  const side = (url.searchParams.get("side") as "playerOne" | "playerTwo") ?? "playerOne";

  return {
    gameId: params.gameId,
    forkStep: Number.isFinite(step) && step >= 0 ? step : 0,
    humanSide: (side === "playerTwo" ? "playerTwo" : "playerOne") as "playerOne" | "playerTwo",
  };
}
