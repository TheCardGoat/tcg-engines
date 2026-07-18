import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op08Wapol014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-014 Wapol", () => {
  test("with DON!! x1 applies both power modifiers for their printed durations", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08Wapol014, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const wapolId = engine.findCardInZone("south", "character", op08Wapol014);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.attachDon(wapolId, 1, "south");

    engine.declareAttack(wapolId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Wapol's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      1000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === wapolId)?.power).toBe(
      9000,
    );

    engine.endTurn("south");
    view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === wapolId)?.power).toBe(
      8000,
    );

    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === wapolId),
    ).toMatchObject({ power: 6000, attachedDon: 0 });
  });

  test("without attached DON!! offers no power target or boost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op08Wapol014, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const wapolId = engine.findCardInZone("south", "character", op08Wapol014);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(wapolId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === wapolId)?.power).toBe(
      6000,
    );
  });
});
