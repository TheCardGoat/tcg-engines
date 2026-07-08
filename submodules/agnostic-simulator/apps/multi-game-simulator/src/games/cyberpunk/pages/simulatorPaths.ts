export const CYBERPUNK_SIMULATOR_BASE_PATH = "/cyberpunk/simulator";

export function cyberpunkSimulatorPath(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${CYBERPUNK_SIMULATOR_BASE_PATH}${normalizedPath}`;
}
