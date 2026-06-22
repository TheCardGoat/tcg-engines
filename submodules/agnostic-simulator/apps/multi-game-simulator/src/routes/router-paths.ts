export function normalizeRouterBasename(baseUrl: string | undefined): string {
  const trimmed = baseUrl?.trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}

export function buildMountedHref(
  path: string,
  basename: string | undefined = import.meta.env.BASE_URL,
): string {
  const normalizedBasename = normalizeRouterBasename(basename);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedBasename === "/" ? normalizedPath : `${normalizedBasename}${normalizedPath}`;
}
