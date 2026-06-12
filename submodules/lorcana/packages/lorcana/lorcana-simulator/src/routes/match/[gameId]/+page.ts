export const ssr = false;

export function load({ params, url }: { params: { gameId: string }; url: URL }) {
  return {
    gameId: params.gameId,
    spectate: url.searchParams.has("spectate"),
  };
}
