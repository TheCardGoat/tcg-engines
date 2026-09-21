/**
 * Game-agnostic client-authority recovery math, shared by every simulator
 * that mirrors practice boards onto the server via `push_state`.
 *
 * In client-authority matches the browser engine is the source of truth and
 * the server mirror is a replica of the client's version chain. When the
 * server rejects a push as stale, the client must re-attach its numbering to
 * the server's chain head (rebase) instead of assuming the server is ahead
 * and waiting for a broadcast that will never come.
 */

export type ClientAuthorityStaleResolution<T = unknown> =
  | { action: "ack" }
  | { action: "rebase"; baseVersion: number }
  | { action: "silent_rebuild"; snapshot: T }
  | { action: "ask_reload" };

export function resolveClientAuthorityStaleRejection<T>(input: {
  localVersion: number;
  serverCurrentVersion: number;
  snapshot?: T | null;
  /**
   * Version the snapshot was stored under. A snapshot only justifies acking
   * when it is actually current: after a component remount, the React
   * context still holds the page-load bootstrap, which can be arbitrarily
   * stale. Callers that cannot know the version opt out by omitting it and
   * get the legacy trust-the-snapshot behavior.
   */
  snapshotVersion?: number;
  recoveredOnce: boolean;
}): ClientAuthorityStaleResolution<NonNullable<T>> {
  if (input.serverCurrentVersion >= input.localVersion) {
    const snapshotCurrent =
      input.snapshot != null &&
      (input.snapshotVersion === undefined || input.snapshotVersion >= input.serverCurrentVersion);
    if (snapshotCurrent) {
      return { action: "ack" };
    }
    // Either no snapshot at all (chain bookkeeping diverged, e.g. a
    // rehydrate against an empty bootstrap) or a stale one (remount from an
    // old page load). Acking would strand the client numbering on a chain
    // the server already passed; rebasing re-attaches it. baseVersion is the
    // next version the server's CAS accepts: stored head + 1, so the rebase
    // push carries expectedVersion == serverCurrentVersion. Repeat rebases
    // are safe: each one re-attaches to the fresher reported head, so
    // repeated stale rejections converge instead of looping.
    return { action: "rebase", baseVersion: input.serverCurrentVersion + 1 };
  }
  if (input.recoveredOnce || input.snapshot == null) {
    return { action: "ask_reload" };
  }
  return { action: "silent_rebuild", snapshot: input.snapshot };
}

export function initialClientAuthorityLastPushedVersion(input: {
  hydratedFromServer: boolean;
  localVersion: number;
  serverVersion?: number | null;
}): number {
  if (!input.hydratedFromServer) return -1;
  if (typeof input.serverVersion === "number" && input.serverVersion >= 0) {
    // The stored chain version outranks the snapshot's internal stateID: a
    // rebase (or recovered baseline) renumbers the chain away from stateID 0,
    // so a later hydration must resume at the server's head, not the stateID.
    return Math.max(input.serverVersion, input.localVersion);
  }
  return input.localVersion;
}

/**
 * Offset that maps a restored engine's internal stateIDs onto the server's
 * stored chain. Without it, a snapshot restored after a rebase would push
 * `stateID + 0` and be rejected as stale forever (stateID 1 against head 5).
 */
export function clientAuthorityPushedVersionOffset(input: {
  hydratedFromServer: boolean;
  serverVersion?: number | null;
  engineStateId: number;
}): number {
  if (
    !input.hydratedFromServer ||
    typeof input.serverVersion !== "number" ||
    input.serverVersion < 0
  ) {
    return 0;
  }
  return Math.max(0, input.serverVersion - input.engineStateId);
}

export function shouldToastClientAuthorityRejection(input: {
  code: "rejected_stale" | "rejected_illegal";
  clientAuthority: boolean;
}): boolean {
  return !(input.clientAuthority && input.code === "rejected_stale");
}

export const MATCH_RELOAD_FEEDBACK = {
  title: "Board out of date",
  message: "Reload the page to get the latest board.",
} as const;

export function shouldAutoSyncFromServerCode(code: string | undefined): boolean {
  return code === "rejected_stale";
}

export function describeLiveMatchServerFeedback(input: {
  code?: string;
  message: string;
  authority?: "server" | "client";
}): {
  title: string;
  message: string;
  severity: "error" | "warning";
} {
  if (input.code === "rejected_stale" || input.code === "match_operation_failed") {
    if (input.authority === "client") {
      return {
        title: MATCH_RELOAD_FEEDBACK.title,
        message: MATCH_RELOAD_FEEDBACK.message,
        severity: "warning",
      };
    }
    return {
      title: "Older board",
      message: "This update was based on an older board.",
      severity: "warning",
    };
  }
  return {
    title: "Couldn't apply that action",
    message: input.message,
    severity: "error",
  };
}
