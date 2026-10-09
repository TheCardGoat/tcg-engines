import { afterEach, describe, expect, test, vi } from "vitest";
import type { FilteredMatchView } from "@tcg/cyberpunk-engine";
import { logHandVisibilityDiagnostics } from "./handVisibilityDiagnostics";

vi.mock("../../../../lib/debug-logging", () => ({ logDebugSnapshot: vi.fn() }));

import { logDebugSnapshot } from "../../../../lib/debug-logging";

afterEach(() => vi.clearAllMocks());

describe("logHandVisibilityDiagnostics", () => {
  test("logs mapping and visibility counts without card or actor identities", () => {
    const projection = {
      gamePhase: "setup",
      players: {
        actorA: {
          zones: {
            hand: [
              { instanceId: "secret-instance", definitionId: "secret-definition", faceDown: true },
            ],
          },
        },
        actorB: { zones: { hand: 6 } },
      },
    } as unknown as FilteredMatchView;

    logHandVisibilityDiagnostics({
      source: "bootstrap",
      version: 0,
      projection,
      actorIds: { player: "actorA", opponent: "actorB" },
    });

    expect(logDebugSnapshot).toHaveBeenCalledWith(
      "[hand-debug]",
      expect.objectContaining({
        source: "bootstrap",
        actorMapping: {
          resolved: true,
          distinct: true,
          playerPresent: true,
          opponentPresent: true,
          viewerSeat: 0,
        },
        players: [
          expect.objectContaining({
            relation: "player",
            handShape: "array",
            identifiedCardCount: 1,
            physicalFaceDownCount: 1,
          }),
          expect.objectContaining({
            relation: "opponent",
            handShape: "count",
            hiddenIdentityCount: 6,
          }),
        ],
      }),
    );
    const payload = JSON.stringify(vi.mocked(logDebugSnapshot).mock.calls[0]?.[1]);
    expect(payload).not.toContain("actorA");
    expect(payload).not.toContain("secret-instance");
    expect(payload).not.toContain("secret-definition");
  });

  test("stays quiet after setup when the owner hand is healthy", () => {
    const projection = {
      gamePhase: "main",
      players: {
        actorA: { zones: { hand: [{ definitionId: "definition-1", faceDown: false }] } },
        actorB: { zones: { hand: 5 } },
      },
    } as unknown as FilteredMatchView;

    logHandVisibilityDiagnostics({
      source: "state_update",
      version: 12,
      projection,
      actorIds: { player: "actorA", opponent: "actorB" },
    });

    expect(logDebugSnapshot).not.toHaveBeenCalled();
  });
});
