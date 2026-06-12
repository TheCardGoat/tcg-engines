export const ssr = false;

export function load({ params, url }: { params: { gameId: string }; url: URL }) {
  const step = url.searchParams.get("step");
  return { gameId: params.gameId, initialStep: step ? Number(step) : undefined };
}
