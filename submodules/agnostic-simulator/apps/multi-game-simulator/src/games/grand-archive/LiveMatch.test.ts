import { describe, expect, it } from "vite-plus/test";
import { createGrandArchiveCatalogSmokeFixture } from "@tcg/grand-archive-engine/automation";
import { projectGrandArchiveViewerState } from "@tcg/grand-archive-engine/simulator";

import { parseGrandArchiveLiveViewerState } from "./LiveMatch.page";
import { grandArchiveSafeRedirectSearch } from "./LiveMatchLanding.page";

describe("Grand Archive live viewer-state parsing", () => {
  it("accepts the engine's viewer-safe projection", () => {
    const { program, initialState } = createGrandArchiveCatalogSmokeFixture(20260826);
    const viewerId = initialState.turnOrder[0]!;
    const view = projectGrandArchiveViewerState(program, initialState, viewerId);

    expect(parseGrandArchiveLiveViewerState(view)).toBe(view);
  });

  it("rejects an incomplete authoritative payload", () => {
    expect(
      parseGrandArchiveLiveViewerState({
        schemaVersion: 1,
        stateVersion: 4,
        selfId: "p1",
        players: [],
      }),
    ).toBeNull();
  });

  it("strips credentials and viewer identity from landing redirects", () => {
    expect(
      grandArchiveSafeRedirectSearch(
        "?ticket=secret&authToken=token&playerId=p1&role=player&spectate=true&gameId=old&source=matchmaking",
      ),
    ).toBe("?source=matchmaking");
  });
});
