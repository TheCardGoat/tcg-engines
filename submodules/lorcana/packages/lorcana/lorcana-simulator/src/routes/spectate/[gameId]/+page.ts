export const ssr = false;

export function load({ params }: { params: { gameId: string } }) {
  return { gameId: params.gameId };
}
