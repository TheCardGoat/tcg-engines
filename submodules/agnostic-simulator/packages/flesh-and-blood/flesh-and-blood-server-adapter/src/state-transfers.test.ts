import { describe, expect, it } from "vitest";
import {
  fabHiddenZoneTransfers,
  fabLatestAnnouncementTransition,
  redactFabTransferLocations,
  type FabZoneLocations,
} from "./state-transfers";

function locations(entries: readonly [string, string][]): FabZoneLocations {
  return new Map(
    entries.map(([id, zone]) => [id, { kind: "zone", id: `p1:${zone}`, ownerId: "p1" }]),
  );
}

describe("snapshot location hints", () => {
  it("preserves simultaneous pitch returns and draws even when deck count is unchanged", () => {
    const plan = fabHiddenZoneTransfers(
      locations([
        ["a", "pitch"],
        ["b", "deck"],
      ]),
      locations([
        ["a", "deck"],
        ["b", "hand"],
      ]),
      "turn",
    );
    expect(plan?.steps).toEqual([
      expect.objectContaining({
        entity: { kind: "entity", id: "a" },
        from: expect.objectContaining({ id: "p1:pitch" }),
        to: expect.objectContaining({ id: "p1:deck" }),
      }),
      expect.objectContaining({
        entity: { kind: "entity", id: "b" },
        from: expect.objectContaining({ id: "p1:deck" }),
        to: expect.objectContaining({ id: "p1:hand" }),
      }),
    ]);
    expect(
      plan?.steps.every((step) => step.type === "entityTransfer" && step.durationMs === undefined),
    ).toBe(true);
  });

  it("redacts hidden physical identities before transport", () => {
    const plan = fabHiddenZoneTransfers(
      locations([["private-id", "deck"]]),
      locations([["private-id", "hand"]]),
      "draw",
    );
    const opponent = redactFabTransferLocations(plan, new Set());
    expect(JSON.stringify(opponent)).not.toContain("private-id");
    expect(opponent?.steps[0]).toMatchObject({
      entity: { id: "fab-hidden:draw:location:0" },
      sourceFace: "hidden",
      destinationFace: "hidden",
    });
    expect(redactFabTransferLocations(plan, new Set(["private-id"]))?.steps[0]).toMatchObject({
      entity: { id: "private-id" },
    });
  });

  it("does not invent movement for unchanged locations or token creation", () => {
    expect(
      fabHiddenZoneTransfers(
        locations([["a", "hand"]]),
        locations([
          ["a", "hand"],
          ["token", "permanent"],
        ]),
        "state",
      ),
    ).toBeNull();
  });

  it("announces a new turn even when no hidden card changes location", () => {
    const plan = fabHiddenZoneTransfers(locations([]), locations([]), "pass", {
      kind: "turn",
      fromPlayerId: "p1",
      toPlayerId: "p2",
      turnNumber: 2,
    });

    expect(plan?.steps).toEqual([
      {
        id: "pass:turn",
        type: "phaseChange",
        from: "p1",
        to: "p2",
        variant: "turn",
        player: { kind: "player", id: "p2" },
        turnNumber: 2,
        startAtMs: 0,
        durationMs: 1_600,
        audioCue: "turn.change",
      },
    ]);
    expect(redactFabTransferLocations(plan, new Set())?.steps).toEqual(plan?.steps);
  });

  it("announces only the settled combat step after intermediate steps auto-pass", () => {
    const announcement = fabLatestAnnouncementTransition(
      { activePlayerId: "p1", turnNumber: 1, combatStep: "attack" },
      { activePlayerId: "p1", turnNumber: 1, combatStep: "reaction" },
    );
    const plan = fabHiddenZoneTransfers(locations([]), locations([]), "auto-pass", announcement);

    expect(plan?.steps).toEqual([
      {
        id: "auto-pass:combat-step",
        type: "phaseChange",
        from: "attack-step",
        to: "reaction-step",
        variant: "phase",
        startAtMs: 0,
        durationMs: 4_000,
        audioCue: "phase.change",
      },
    ]);
  });

  it("prefers a turn handoff and ignores combat closure", () => {
    expect(
      fabLatestAnnouncementTransition(
        { activePlayerId: "p1", turnNumber: 1, combatStep: "close" },
        { activePlayerId: "p2", turnNumber: 2, combatStep: null },
      ),
    ).toEqual({ kind: "turn", fromPlayerId: "p1", toPlayerId: "p2", turnNumber: 2 });
    expect(
      fabLatestAnnouncementTransition(
        { activePlayerId: "p1", turnNumber: 1, combatStep: "close" },
        { activePlayerId: "p1", turnNumber: 1, combatStep: null },
      ),
    ).toBeUndefined();
  });
});
