import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01CharlotteFlampe056,
  eb01MountainGod018,
  eb02Buggy018,
  op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
  op09NicoRobin062,
  op13Otama043,
  op13WindmillVillage022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;

describe("Official general FAQ", () => {
  test("Q5: playing a Stage replaces the existing Stage after paying the new Stage's cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13WindmillVillage022, op13WindmillVillage022],
      activeDon: 2,
    });
    const firstStageId = engine.findCardInZone("south", "hand", op13WindmillVillage022);

    engine.playCard(op13WindmillVillage022);
    const secondStageId = engine.findCardInZone("south", "hand", op13WindmillVillage022);
    engine.playCard(op13WindmillVillage022);

    expect(engine.getView("south").players.south.stage?.instanceId).toBe(secondStageId);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      firstStageId,
    );
  });

  test("Q6: a player view preserves a hand larger than the opening-hand size", () => {
    const engine = OnePieceTestEngine.create({ hand: 60 });

    expect(engine.getView("south").players.south.hand).toHaveLength(60);
  });

  test("Q12 and Q22: a zero-cost [Counter] is usable without DON!! during Counter Step, not Main Phase", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037, eb01Doma005],
      },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
    );

    expect(
      engine.expectFailure({
        type: "playCard",
        seat: "north",
        instanceId: eventId,
      }).reason,
    ).toBe("Cards can only be played during your main phase.");

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const counter = engine.pendingDecision("battleCounter", "north").steps[0];
    expect(counter?.kind).toBe("selectEntity");
    if (counter?.kind !== "selectEntity") throw new Error("Expected a Counter decision.");
    expect(counter.candidates.map((candidate) => candidate.ref.id)).toContain(eventId);
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    expect(engine.getView("north").players.north.restedDon).toBe(0);
  });

  test("Q13: Refresh returns given DON!! to the cost area and readies it", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 1,
      },
      {},
      SOUTH_ATTACKS,
    );
    const targetId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.attachDon(targetId, 1, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.attachedDon,
    ).toBe(1);
    engine.endTurn("south");
    engine.endTurn("north");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.attachedDon,
    ).toBe(0);
    expect(engine.getView("south").players.south.activeDon).toBeGreaterThanOrEqual(1);
  });

  test("Q19 and Q21: only a hand Character Counter is offered, and it needs no DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [eb01Doma005],
        character: [eb01Doma005],
      },
      SOUTH_ATTACKS,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const handCounterId = engine.findCardInZone("north", "hand", eb01Doma005);
    const fieldCounterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const counter = engine.pendingDecision("battleCounter", "north").steps[0];
    expect(counter?.kind).toBe("selectEntity");
    if (counter?.kind !== "selectEntity") throw new Error("Expected a Counter decision.");
    expect(counter.candidates.map((candidate) => candidate.ref.id)).toContain(handCounterId);
    expect(counter.candidates.map((candidate) => candidate.ref.id)).not.toContain(fieldCounterId);
    engine.resolveDecision("battleCounter", { selectedIds: [handCounterId] }, "north");

    expect(engine.getView("north").players.north.restedDon).toBe(0);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      handCounterId,
    );
  });

  test("Q39 and Q40: an up-to target effect can select zero and resolves with no valid target", () => {
    const noTarget = OnePieceTestEngine.create({ stage: op13WindmillVillage022 });
    const noTargetId = noTarget.findCardInZone("south", "stage", op13WindmillVillage022);

    noTarget.activateEffect(noTargetId, "activateMain");
    noTarget.resolveDecision("effectOptional", { optionId: "yes" });
    expect(noTarget.getView("south").prompts).toHaveLength(0);

    const chooseZero = OnePieceTestEngine.create({
      stage: op13WindmillVillage022,
      character: [op13Otama043],
    });
    const stageId = chooseZero.findCardInZone("south", "stage", op13WindmillVillage022);
    chooseZero.activateEffect(stageId, "activateMain");
    chooseZero.resolveDecision("effectOptional", { optionId: "yes" });
    chooseZero.resolveDecision("effectTargetSelection", { selectedIds: [] });

    expect(chooseZero.getView("south").prompts).toHaveLength(0);
  });

  test("Q33: Banish trashes damaged Life and does not offer its [Trigger]", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op09NicoRobin062 },
      { life: [op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037] },
      SOUTH_ATTACKS,
    );
    const lifeCardId = engine.findCardInZone(
      "north",
      "life",
      op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    expect(engine.getView("north").decisions).toHaveLength(0);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      lifeCardId,
    );
  });

  test("Q34 and Q36: Double Attack deals its fixed two damage but does not win through one Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb02Buggy018], activeDon: 4 },
      { life: [eb01Doma005] },
      SOUTH_ATTACKS,
    );

    engine.playCard(eb02Buggy018, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [engine.leader("south")] });
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    expect(engine.getView("south").status).toBe("active");
    expect(engine.getView("south").players.north.lifeCount).toBe(0);
  });

  test("Q37 and Q38: a damage Trigger may be declined, but an effect moving Life cannot activate it", () => {
    const damage = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037] },
      SOUTH_ATTACKS,
    );
    const attackerId = damage.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = damage.findCardInZone(
      "north",
      "life",
      op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
    );
    damage.declareAttack(attackerId, damage.leader("north"), "south");
    damage.resolveDecision("lifeTrigger", { optionId: "skip" }, "north");
    expect(damage.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      triggerId,
    );

    const effect = OnePieceTestEngine.create({
      hand: [eb01CharlotteFlampe056],
      life: [op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037],
      activeDon: 1,
    });
    const lifeId = effect.findCardInZone(
      "south",
      "life",
      op05BecauseTheSideOfJusticeWillBeWhicheverSideWins037,
    );
    effect.playCard(eb01CharlotteFlampe056);
    effect.resolveDecision("effectOptional", { optionId: "yes" });

    expect(effect.getView("south").prompts).toHaveLength(0);
    expect(effect.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      lifeId,
    );
  });
});
