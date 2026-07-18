import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  eb03BoaHancock026,
  eb03InsolentFoolStandDown029,
  eb03Marguerite027,
  op07BoaHancock038,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-029 Insolent Fool!! Stand Down!!", () => {
  test("pays the Main costs and maps the Amazon Lily-or-Kuja Pirates play union", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07BoaHancock038,
      hand: [eb03InsolentFoolStandDown029, eb03Marguerite027, eb03BoaHancock026],
      activeDon: 5,
    });
    const eventId = engine.findCardInZone("south", "hand", eb03InsolentFoolStandDown029);
    const amazonLilyId = engine.findCardInZone("south", "hand", eb03Marguerite027);
    const kujaPiratesId = engine.findCardInZone("south", "hand", eb03BoaHancock026);

    engine.playCard(eb03InsolentFoolStandDown029);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const playDecision = engine.pendingDecision("effectPlaySelection", "south");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected Boa Hancock's controller to receive the Character play choice.");
    }
    expect(playStep).toMatchObject({ min: 0, max: 1 });
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      amazonLilyId,
      kujaPiratesId,
    ]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [amazonLilyId] }, "south");

    const playedOnPlay = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(playedOnPlay?.kind).toBe("selectEntity");
    if (playedOnPlay?.kind !== "selectEntity") {
      throw new Error("Expected the played Marguerite's optional return choice.");
    }
    expect(playedOnPlay.candidates.map((candidate) => candidate.ref.id)).toEqual([amazonLilyId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === amazonLilyId)).toBe(
      true,
    );
    expect(view.players.south.hand.some((card) => card.instanceId === kujaPiratesId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("pays the pre-colon DON!! cost before a non-Boa Leader makes the play do nothing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03InsolentFoolStandDown029, eb03Marguerite027],
      activeDon: 5,
    });
    const eventId = engine.findCardInZone("south", "hand", eb03InsolentFoolStandDown029);
    const playId = engine.findCardInZone("south", "hand", eb03Marguerite027);

    engine.playCard(eb03InsolentFoolStandDown029);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.some((card) => card.instanceId === playId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the defender choose only a Boa Hancock Leader or Character for Counter power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op07BoaHancock038,
        hand: [eb03InsolentFoolStandDown029],
        character: [eb03BoaHancock026, eb03Marguerite027],
        activeDon: 1,
        life: 2,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", eb03InsolentFoolStandDown029);
    const boaCharacterId = engine.findCardInZone("north", "character", eb03BoaHancock026);
    const unrelatedId = engine.findCardInZone("north", "character", eb03Marguerite027);

    engine.endTurn("south");
    engine.endTurn("north");
    const lifeBeforeAttack = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the Boa Hancock Counter choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      boaCharacterId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBeforeAttack);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
