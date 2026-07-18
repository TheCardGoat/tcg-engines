import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op04Ulti043 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-043 Ulti", () => {
  test("with DON!! x1, returns either player's eligible Character to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Ulti043, attachedDon: 1, playedOnTurn: 0 }, eb01Doma005] },
      { character: [eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ultiId = engine.findCardInZone("south", "character", op04Ulti043);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(ultiId, engine.leader("north"), "south");

    const destination = engine.pendingDecision("effectActionChoice", "south");
    expect(destination.actorId).toBe("south");
    const destinationStep = destination.steps[0];
    expect(destinationStep?.kind).toBe("chooseOption");
    if (destinationStep?.kind !== "chooseOption")
      throw new Error("Expected Ulti's destination choice.");
    expect(destinationStep.options.map((option) => option.label)).toEqual([
      "returnToHand",
      "returnToDeck",
    ]);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south");
    expect(target.actorId).toBe("south");
    const targetStep = target.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") throw new Error("Expected Ulti's Character choice.");
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      tooExpensiveId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    // Opposing hands are hidden in the public view; raw state is the narrow physical-identity boundary.
    expect(engine.getState().players.north.hand).toContain(opposingId);
    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === opposingId)).toBe(
      false,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === ownId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may put an eligible physical Character at the bottom of its owner's deck", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Ulti043, attachedDon: 1, playedOnTurn: 0 }, eb01Doma005] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ultiId = engine.findCardInZone("south", "character", op04Ulti043);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(ultiId, engine.leader("north"), "south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    // Deck order is hidden; raw state proves the selected physical card reached the bottom.
    expect(engine.getState().players.south.deck.at(-1)).toBe(ownId);
    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === ownId)).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose zero, while attacking without DON!! does not offer the effect", () => {
    const zeroEngine = OnePieceTestEngine.create(
      { character: [{ card: op04Ulti043, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zeroUltiId = zeroEngine.findCardInZone("south", "character", op04Ulti043);
    const untouchedId = zeroEngine.findCardInZone("north", "character", eb01Doma005);

    zeroEngine.declareAttack(zeroUltiId, zeroEngine.leader("north"), "south");
    zeroEngine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");
    const target = zeroEngine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    zeroEngine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      zeroEngine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === untouchedId),
    ).toBe(true);
    expect(zeroEngine.getView("south").prompts).toHaveLength(0);

    const gatedEngine = OnePieceTestEngine.create(
      { character: [{ card: op04Ulti043, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const gatedUltiId = gatedEngine.findCardInZone("south", "character", op04Ulti043);
    const gatedTargetId = gatedEngine.findCardInZone("north", "character", eb01Doma005);

    gatedEngine.declareAttack(gatedUltiId, gatedEngine.leader("north"), "south");

    expect(
      gatedEngine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === gatedTargetId),
    ).toBe(true);
    expect(gatedEngine.getView("south").prompts).toHaveLength(0);
  });
});
