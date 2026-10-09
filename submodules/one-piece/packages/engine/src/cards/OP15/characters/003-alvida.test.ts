import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Alvida003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("OP15-003 Alvida", () => {
  test("Activate Main pays opponent rested DON!! then gives own rested DON!! once per turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Alvida003], restedDon: 2 },
      { character: [eb01Doma005], restedDon: 2 },
    );
    const sourceId = engine.findCardInZone("south", "character", op15Alvida003);
    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    expect(engine.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(engine.getView("south").players.south.restedDon).toBe(1);
    expect(engine.getView("south").players.north.restedDon).toBe(1);
    expect(engine.getView("south").players.north.characters[0]?.attachedDon).toBe(1);
    // Both donor pools still fund another payment; only OPT prevents it.
    const failed = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: sourceId,
      trigger: "activateMain",
    });
    expect(failed.accepted).toBe(false);
    expect(
      OnePieceTestEngine.fromState(failed.state).getView("south").players.north.restedDon,
    ).toBe(1);
  });

  test("may decline the Activate Main payment without giving either owner's DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Alvida003], restedDon: 1 },
      { character: [eb01Doma005], restedDon: 1 },
    );
    const sourceId = engine.findCardInZone("south", "character", op15Alvida003);
    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.restedDon).toBe(1);
    expect(engine.getView("south").players.north.restedDon).toBe(1);
    expect(engine.getView("south").players.north.characters[0]?.attachedDon).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("replaces its own K.O. by trashing a Character card with 6000 or less power from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op15Alvida003, rested: true }],
        hand: [eb01Doma005, "OP16-039", "OP16-096"],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-096", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const alvidaId = engine.findCardInZone("south", "character", op15Alvida003);
    const fodderId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eventId = engine.findCardInZone("south", "hand", "OP16-039");
    const tooStrongId = engine.findCardInZone("south", "hand", "OP16-096");
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    engine.declareAttack(attackerId, alvidaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const replacement = engine.pendingDecision("battleKoReplacement", "south").steps[0];
    if (replacement?.kind !== "selectEntity") throw new Error("Expected the replacement trash.");
    const candidates = replacement.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(fodderId);
    expect(candidates).not.toContain(eventId);
    expect(candidates).not.toContain(tooStrongId);
    engine.resolveDecision("battleKoReplacement", { selectedIds: [fodderId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(alvidaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(fodderId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([eventId, tooStrongId]);
    expect(view.prompts).toHaveLength(0);
  });

  test("declining the replacement lets the K.O. through", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op15Alvida003, rested: true }],
        hand: [eb01Doma005],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-096", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const alvidaId = engine.findCardInZone("south", "character", op15Alvida003);
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    engine.declareAttack(attackerId, alvidaId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("battleKoReplacement", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(alvidaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(alvidaId);
    expect(view.prompts).toHaveLength(0);
  });
});
