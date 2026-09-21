import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import {
  clientAuthorityPushedVersionOffset,
  describeLiveMatchServerFeedback,
  initialClientAuthorityLastPushedVersion,
  MATCH_RELOAD_FEEDBACK,
  resolveClientAuthorityStaleRejection,
  shouldAutoSyncFromServerCode,
  shouldToastClientAuthorityRejection,
} from "./clientAuthoritySync.ts";

describe("client-authority live sync", () => {
  test("skips the init push when the engine was hydrated from the server snapshot", () => {
    expect(
      initialClientAuthorityLastPushedVersion({ hydratedFromServer: true, localVersion: 24 }),
    ).toBe(24);
    expect(
      initialClientAuthorityLastPushedVersion({ hydratedFromServer: false, localVersion: 0 }),
    ).toBe(-1);
  });

  test("anchors hydration to the stored chain version after a rebase", () => {
    // Incident shape: the server chain head is 5, but the restored snapshot's
    // internal stateID is 1 (the client renumbered onto the chain via an
    // offset rebase before this hydration). Pushes must resume at 5.
    expect(
      initialClientAuthorityLastPushedVersion({
        hydratedFromServer: true,
        localVersion: 1,
        serverVersion: 5,
      }),
    ).toBe(5);
    expect(
      clientAuthorityPushedVersionOffset({
        hydratedFromServer: true,
        serverVersion: 5,
        engineStateId: 1,
      }),
    ).toBe(4);
    // Fresh local engine: unchanged legacy behavior.
    expect(
      initialClientAuthorityLastPushedVersion({ hydratedFromServer: false, localVersion: 3 }),
    ).toBe(-1);
    expect(
      clientAuthorityPushedVersionOffset({
        hydratedFromServer: false,
        serverVersion: 5,
        engineStateId: 3,
      }),
    ).toBe(0);
    // Degenerate stored version below the stateID: clamp, never go negative.
    expect(
      clientAuthorityPushedVersionOffset({
        hydratedFromServer: true,
        serverVersion: 0,
        engineStateId: 1,
      }),
    ).toBe(0);
    expect(
      initialClientAuthorityLastPushedVersion({
        hydratedFromServer: true,
        localVersion: 1,
        serverVersion: 0,
      }),
    ).toBe(1);
  });

  test("treats a stale rejection at the local version as an in-sync no-op", () => {
    expect(
      resolveClientAuthorityStaleRejection({
        localVersion: 24,
        serverCurrentVersion: 24,
        snapshot: { ctx: { stateID: 24 } },
        recoveredOnce: false,
      }),
    ).toEqual({ action: "ack" });
  });

  test("silently rebuilds from the last accepted snapshot once", () => {
    const snapshot = { ctx: { stateID: 24 } };
    expect(
      resolveClientAuthorityStaleRejection({
        localVersion: 30,
        serverCurrentVersion: 24,
        snapshot,
        recoveredOnce: false,
      }),
    ).toEqual({ action: "silent_rebuild", snapshot });
  });

  test("asks for a page reload when there is no snapshot to recover from", () => {
    expect(
      resolveClientAuthorityStaleRejection({
        localVersion: 30,
        serverCurrentVersion: 24,
        snapshot: undefined,
        recoveredOnce: false,
      }),
    ).toEqual({ action: "ask_reload" });
  });

  test("asks for a page reload instead of recovering a second time", () => {
    expect(
      resolveClientAuthorityStaleRejection({
        localVersion: 30,
        serverCurrentVersion: 24,
        snapshot: { ctx: { stateID: 24 } },
        recoveredOnce: true,
      }),
    ).toEqual({ action: "ask_reload" });
  });

  test("acks when the server chain already reached the local version and a snapshot exists", () => {
    expect(
      resolveClientAuthorityStaleRejection({
        localVersion: 24,
        serverCurrentVersion: 25,
        snapshot: { ctx: { stateID: 24 } },
        recoveredOnce: false,
      }),
    ).toEqual({ action: "ack" });
  });

  test("rebases when the context snapshot is stale even though one exists", () => {
    // Remount shape: the React context still holds the page-load bootstrap
    // (v0) while the server chain has moved to 21. A present-but-stale
    // snapshot must not produce an ack — that strands the client numbering
    // on a chain the server already passed.
    expect(
      resolveClientAuthorityStaleRejection({
        localVersion: 0,
        serverCurrentVersion: 21,
        snapshot: { ctx: { stateID: 0 } },
        snapshotVersion: 0,
        recoveredOnce: false,
      }),
    ).toEqual({ action: "rebase", baseVersion: 22 });
  });

  test("acks a snapshot that is current against the reported head", () => {
    expect(
      resolveClientAuthorityStaleRejection({
        localVersion: 24,
        serverCurrentVersion: 25,
        snapshot: { ctx: { stateID: 24 } },
        snapshotVersion: 25,
        recoveredOnce: false,
      }),
    ).toEqual({ action: "ack" });
  });

  test("callers without snapshot version info keep the legacy trust-the-snapshot ack", () => {
    expect(
      resolveClientAuthorityStaleRejection({
        localVersion: 0,
        serverCurrentVersion: 21,
        snapshot: { ctx: { stateID: 0 } },
        recoveredOnce: false,
      }),
    ).toEqual({ action: "ack" });
  });

  test("rebases onto the server's next acceptable version when it is ahead with no snapshot", () => {
    // Incident shape: the browser rehydrated an empty state (local 0) while the
    // server worker's chain bookkeeping sat at head 21, so every push numbered
    // from 0 was rejected as stale with currentVersion 21.
    expect(
      resolveClientAuthorityStaleRejection({
        localVersion: 0,
        serverCurrentVersion: 21,
        snapshot: undefined,
        recoveredOnce: false,
      }),
    ).toEqual({ action: "rebase", baseVersion: 22 });
  });

  test("rebases on an equal-version stale rejection when no snapshot exists", () => {
    expect(
      resolveClientAuthorityStaleRejection({
        localVersion: 21,
        serverCurrentVersion: 21,
        snapshot: null,
        recoveredOnce: false,
      }),
    ).toEqual({ action: "rebase", baseVersion: 22 });
  });

  test("does not toast client-authority stale rejections as move failures", () => {
    expect(
      shouldToastClientAuthorityRejection({ code: "rejected_stale", clientAuthority: true }),
    ).toBe(false);
    expect(
      shouldToastClientAuthorityRejection({ code: "rejected_illegal", clientAuthority: true }),
    ).toBe(true);
    expect(
      shouldToastClientAuthorityRejection({ code: "rejected_stale", clientAuthority: false }),
    ).toBe(true);
  });

  test("only auto-recovers rejected_stale, not generic match failures", () => {
    expect(shouldAutoSyncFromServerCode("rejected_stale")).toBe(true);
    expect(shouldAutoSyncFromServerCode("match_operation_failed")).toBe(false);
    expect(shouldAutoSyncFromServerCode("not_a_player")).toBe(false);
  });

  test("describes a page reload instead of the raw server code", () => {
    expect(
      describeLiveMatchServerFeedback({
        code: "match_operation_failed",
        message: "This update was based on an older board.",
        authority: "client",
      }),
    ).toEqual({
      title: MATCH_RELOAD_FEEDBACK.title,
      message: MATCH_RELOAD_FEEDBACK.message,
      severity: "warning",
    });
    expect(
      describeLiveMatchServerFeedback({
        code: "rejected_stale",
        message: "Could not load game state",
        authority: "server",
      }),
    ).toEqual({
      title: "Older board",
      message: "This update was based on an older board.",
      severity: "warning",
    });
    expect(
      describeLiveMatchServerFeedback({
        code: "not_a_player",
        message: "Only seated players can push state",
      }),
    ).toEqual({
      title: "Couldn't apply that action",
      message: "Only seated players can push state",
      severity: "error",
    });
  });

  test("live practice board restores once and never re-pushes state as recovery", () => {
    const source = readFileSync("src/games/cyberpunk/pages/LiveMatch.page.tsx", "utf8");
    expect(source).toContain("resolveClientAuthorityStaleRejection");
    expect(source).not.toContain('pushCurrentState("resync"');
    const silentStart = source.indexOf('resolution.action === "silent_rebuild"');
    expect(silentStart).toBeGreaterThan(-1);
    const silentBlock = source.slice(
      silentStart,
      source.indexOf("return;", silentStart) + "return;".length,
    );
    expect(silentBlock).toContain("recoveredOnceRef.current = true");
    expect(silentBlock).not.toContain("pushCurrentState");
    expect(source).toContain("showReloadNotification");
    expect(source).toContain("MATCH_RELOAD_FEEDBACK");
  });

  test("live practice board rebases the push chain onto the server's reported head", () => {
    const source = readFileSync("src/games/cyberpunk/pages/LiveMatch.page.tsx", "utf8");
    const rebaseStart = source.indexOf('resolution.action === "rebase"');
    expect(rebaseStart).toBeGreaterThan(-1);
    const rebaseBlock = source.slice(
      rebaseStart,
      source.indexOf("return;", rebaseStart) + "return;".length,
    );
    // offset maps local stateIDs so the forced push lands at version =
    // baseVersion with expectedVersion = baseVersion - 1 (the server's head).
    expect(rebaseBlock).toContain(
      "pushedVersionOffsetRef.current = resolution.baseVersion - localVersion",
    );
    expect(rebaseBlock).toContain('pushCurrentState("rebase", undefined, true)');
    // every resolution variant must be handled exhaustively before reload
    expect(source).toContain('resolution.action !== "ask_reload"');
  });
});
