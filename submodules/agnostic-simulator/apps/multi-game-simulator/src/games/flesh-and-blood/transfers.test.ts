import { describe, expect, it } from "vitest";
import { fabBoardTransfers, FAB_TRANSFER_DURATION_MS } from "./transfers";
import { fabHiddenZoneTransfers } from "@tcg/flesh-and-blood-server-adapter/animation";
import type { FabPresentationCard, FabPresentationZone } from "./state";

function card(id: string, zone: FabPresentationZone, hidden = false): FabPresentationCard {
  return {
    id,
    zone,
    ownerId: "p1",
    cardId: hidden ? "face-down" : "snatch",
    face: hidden ? "down" : "up",
  };
}
function board(...cards: FabPresentationCard[]) {
  return { cards: Object.fromEntries(cards.map((card) => [card.id, card])) };
}

describe("FAB board transfers", () => {
  it("preserves a turn announcement supplied with snapshot location hints", () => {
    const plan = fabBoardTransfers(board(), board(), "pass", "p1", {
      id: "pass:locations",
      version: 2,
      steps: [
        {
          id: "pass:turn",
          type: "phaseChange",
          from: "p1",
          to: "p2",
          variant: "turn",
          player: { kind: "player", id: "p2" },
          turnNumber: 2,
          durationMs: 1_600,
        },
      ],
    });

    expect(plan?.steps).toEqual([
      expect.objectContaining({ type: "phaseChange", variant: "turn", turnNumber: 2 }),
    ]);
  });

  it("keeps only the latest competing announcement", () => {
    const plan = fabBoardTransfers(board(), board(), "auto-pass", "p1", {
      id: "auto-pass:locations",
      version: 2,
      steps: [
        {
          id: "auto-pass:attack",
          type: "phaseChange",
          from: "layer-step",
          to: "attack-step",
          variant: "phase",
          durationMs: 1_200,
        },
        {
          id: "auto-pass:defend",
          type: "phaseChange",
          from: "attack-step",
          to: "defend-step",
          variant: "phase",
          durationMs: 1_200,
        },
      ],
    });

    expect(plan?.steps).toEqual([
      expect.objectContaining({ id: "auto-pass:defend", to: "defend-step" }),
    ]);
  });

  it("uses location deltas for a pitch return and draw with no net deck-count change", () => {
    const hints = fabHiddenZoneTransfers(
      new Map([
        ["a", { kind: "zone", id: "p1:pitch", ownerId: "p1" }],
        ["b", { kind: "zone", id: "p1:deck", ownerId: "p1" }],
      ]),
      new Map([
        ["a", { kind: "zone", id: "p1:deck", ownerId: "p1" }],
        ["b", { kind: "zone", id: "p1:hand", ownerId: "p1" }],
      ]),
      "end",
    );
    const plan = fabBoardTransfers(
      board(card("a", "pitch"), card("d", "deck", true)),
      board(card("d", "deck", true), card("b", "hand")),
      "end",
      "p1",
      hints,
    );
    expect(plan?.steps).toHaveLength(2);
    expect(plan?.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: expect.objectContaining({ id: "p1:pitch" }),
          to: expect.objectContaining({ id: "p1:deck" }),
        }),
        expect.objectContaining({
          from: expect.objectContaining({ id: "p1:deck" }),
          to: expect.objectContaining({ id: "b" }),
        }),
      ]),
    );
  });
  it.each([
    ["hand", "pitch"],
    ["hand", "combat-chain"],
    ["hand", "stack"],
    ["stack", "graveyard"],
    ["combat-chain", "graveyard"],
    ["combat-chain", "hand"],
    ["combat-chain", "banished"],
    ["pitch", "deck"],
    ["hand", "arsenal"],
    ["arsenal", "combat-chain"],
    ["banished", "hand"],
    ["head", "graveyard"],
    ["stack", "permanent"],
    ["hand", "soul"],
    ["soul", "banished"],
  ] satisfies [FabPresentationZone, FabPresentationZone][])(
    "moves %s to %s with the same primitive",
    (from, to) => {
      const plan = fabBoardTransfers(board(card("a", from)), board(card("a", to)), "move", "p1");
      expect(plan?.steps).toEqual([
        expect.objectContaining({
          type: "entityTransfer",
          entity: { kind: "entity", id: "a" },
          from:
            from === "stack"
              ? { kind: "entity", id: "a" }
              : { kind: "zone", id: `p1:${from}`, ownerId: "p1" },
          to:
            to === "stack"
              ? { kind: "entity", id: "a" }
              : { kind: "zone", id: `p1:${to}`, ownerId: "p1" },
          durationMs: FAB_TRANSFER_DURATION_MS,
        }),
      ]);
    },
  );

  it("draws every card from anonymous deck slots without engine events", () => {
    const plan = fabBoardTransfers(
      board(card("d0", "deck", true), card("d1", "deck", true), card("d2", "deck", true)),
      board(card("d0", "deck", true), card("a", "hand"), card("b", "hand")),
      "draw",
      "p1",
    );
    expect(plan?.steps).toHaveLength(2);
    expect(plan?.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entity: { kind: "entity", id: "a" },
          sourceFace: "hidden",
          destinationFace: "public",
        }),
        expect.objectContaining({
          entity: { kind: "entity", id: "b" },
          sourceFace: "hidden",
          destinationFace: "public",
        }),
      ]),
    );
  });

  it("uses independent anonymous endpoints for an opponent draw", () => {
    const plan = fabBoardTransfers(
      board(card("d", "deck", true)),
      board(card("h", "hand", true)),
      "draw",
      "p2",
    );
    expect(plan?.steps[0]).toMatchObject({
      sourceFace: "hidden",
      destinationFace: "hidden",
      to: { kind: "entity", id: "h" },
    });
  });

  it("reveals an opponent play only at its public destination", () => {
    const plan = fabBoardTransfers(
      board(card("h", "hand", true)),
      board(card("a", "combat-chain")),
      "play",
      "p2",
    );
    expect(plan?.steps[0]).toMatchObject({
      from: { kind: "entity", id: "h" },
      sourceFace: "hidden",
      destinationFace: "public",
    });
  });

  it("returns a public pitched card into an anonymous deck slot", () => {
    const plan = fabBoardTransfers(
      board(card("a", "pitch")),
      board(card("d", "deck", true)),
      "return",
      "p1",
    );
    expect(plan?.steps[0]).toMatchObject({ sourceFace: "public", destinationFace: "hidden" });
  });

  it("does not invent a route for ambiguous hidden changes", () => {
    expect(
      fabBoardTransfers(
        board(card("d", "deck", true), card("h", "hand", true)),
        board(card("a", "pitch"), card("b", "arsenal")),
        "ambiguous",
        "p2",
      ),
    ).toBeNull();
  });

  it("does not animate an identity reveal, counters, tapping, or a synthetic trigger", () => {
    const before = board(card("a", "hand"));
    const after = board(
      { ...card("a", "hand"), tapped: true, counters: [{ label: "power", count: 1 }] },
      { ...card("rules-stack:1", "stack"), sourceInstanceId: "a" },
    );
    expect(fabBoardTransfers(before, after, "effect", "p1")).toBeNull();
    expect(fabBoardTransfers(board(card("h", "hand", true)), before, "reveal", "p1")).toBeNull();
  });

  it("moves directly to the rendered final zone without reconstructing an intermediate stack", () => {
    const plan = fabBoardTransfers(
      board(card("a", "hand")),
      board(card("a", "graveyard")),
      "resolve",
      "p1",
    );
    expect(plan?.steps).toHaveLength(1);
    expect(plan?.steps[0]).toMatchObject({ to: { kind: "zone", id: "p1:graveyard" } });
  });

  it("synchronizes a resolving layer with every combat-chain departure", () => {
    const plan = fabBoardTransfers(
      board(card("reaction", "stack"), card("defender", "combat-chain")),
      board(card("reaction", "graveyard"), card("defender", "banished")),
      "resolve",
      "p1",
    );

    expect(plan?.steps).toHaveLength(2);
    expect(plan?.steps.every((step) => step.startAtMs === 0)).toBe(true);
    expect(plan?.steps.every((step) => step.durationMs === 440)).toBe(true);
  });
});
