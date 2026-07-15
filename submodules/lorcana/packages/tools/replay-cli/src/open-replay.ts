import { spawn } from "node:child_process";

export type OpenMode = "watch" | "fork";
export type ForkSide = "playerOne" | "playerTwo";

export interface BuildReplayUrlOptions {
  baseUrl: string;
  replayId: string;
  step: number;
  mode: OpenMode;
  side?: ForkSide;
}

/**
 * Construct the URL that the simulator's replay route understands. Mirrors
 * the routes:
 *   /replay/[gameId]?step=<n>                 (watch mode)
 *   /replay/[gameId]/fork?step=<n>&side=...   (fork / play-from-here)
 *
 * Throws on `mode === "fork"` without a side so callers cannot accidentally
 * produce a fork URL the page would reject.
 */
export function buildReplayUrl(opts: BuildReplayUrlOptions): string {
  const trimmedBase = opts.baseUrl.replace(/\/+$/, "");
  const encodedId = encodeURIComponent(opts.replayId);
  const stepParam = `step=${encodeURIComponent(String(opts.step))}`;

  if (opts.mode === "fork") {
    if (!opts.side) {
      throw new Error("fork mode requires a side (playerOne or playerTwo)");
    }
    return `${trimmedBase}/replay/${encodedId}/fork?${stepParam}&side=${opts.side}`;
  }
  return `${trimmedBase}/replay/${encodedId}?${stepParam}`;
}

/**
 * Pick the OS-specific command/args to open a URL in the user's default
 * browser. Exposed for tests; the real launcher just forwards these to
 * `spawn`.
 */
export function getOpenCommand(
  platform: NodeJS.Platform,
  url: string,
): { command: string; args: string[] } {
  if (platform === "darwin") return { command: "open", args: [url] };
  if (platform === "win32") return { command: "cmd", args: ["/c", "start", "", url] };
  return { command: "xdg-open", args: [url] };
}

/**
 * Fire-and-forget browser launch. We detach so the CLI process can exit
 * immediately after — closing the CLI should not close the browser tab.
 */
export function openInBrowser(url: string, platform: NodeJS.Platform = process.platform): void {
  const { command, args } = getOpenCommand(platform, url);
  const child = spawn(command, args, { detached: true, stdio: "ignore" });
  child.unref();
}
