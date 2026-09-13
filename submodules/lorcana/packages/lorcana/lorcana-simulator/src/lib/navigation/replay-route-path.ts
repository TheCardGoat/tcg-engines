export function replayRoutePath(gameId: string, basePath: string): string {
  const normalizedBasePath = basePath.replace(/\/+$/, "");

  return `${normalizedBasePath}/replay/${encodeURIComponent(gameId)}`;
}
