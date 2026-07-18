import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01MountainGod018, eb01OffWhite019, op05Pica032 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const koPicaReview: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP05-032-KO",
  canonicalId: "TEST-OP05-032-KO",
  name: "Pica K.O. Review",
  cost: 0,
  effect: "[Main] K.O. up to 1 of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

registerCards([koPicaReview]);

function targetPica(engine: OnePieceTestEngine, picaId: string) {
  engine.playCard(koPicaReview, "north");
  const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
  expect(target?.kind).toBe("selectEntity");
  if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target choice.");
  expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(picaId);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [picaId] }, "north");
}

describe("OP05-032 Pica", () => {
  test("uses the corrected errata requiring exactly one non-Pica Character", () => {
    const replacement = op05Pica032.effects?.replacementEffects?.[0];
    expect(op05Pica032.effect).toContain("you may rest 1 of your Characters");
    expect(replacement?.replacementAction.action).toBe("rest");
    if (replacement?.replacementAction.action !== "rest") {
      throw new Error("Expected Pica's rest replacement.");
    }
    expect(replacement.replacementAction.target.count).toEqual({ amount: 1 });
    expect(replacement.replacementAction.target.filters).toContainEqual({
      filter: "excludeName",
      value: "Pica",
    });
    expect(replacement.eventFilter).toEqual({ targetSelf: true });
  });

  test("at the end of its turn may rest 1 DON!! to set itself active", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op05Pica032, rested: true, playedOnTurn: 0 }],
      activeDon: 1,
    });
    const picaId = engine.findCardInZone("south", "character", op05Pica032);

    engine.endTurn("south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === picaId)?.rested).toBe(
      false,
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
  });

  test("rests another active cost-3-or-more non-Pica instead of an effect K.O. only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op05Pica032, op05Pica032, eb01Doma005, eb01MountainGod018, eb01MountainGod018],
      },
      { hand: [koPicaReview, koPicaReview] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const southCharacters = engine.getView("south").players.south.characters;
    const picaIds = southCharacters
      .filter((card) => card?.cardId === op05Pica032.id)
      .map((card) => card!.instanceId);
    const mountainIds = southCharacters
      .filter((card) => card?.cardId === eb01MountainGod018.id)
      .map((card) => card!.instanceId);
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const picaId = picaIds[0]!;

    targetPica(engine, picaId);
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(payment?.kind).toBe("selectEntity");
    if (payment?.kind !== "selectEntity") throw new Error("Expected Pica's rest replacement.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(mountainIds);
    expect(payment.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([...picaIds, domaId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [mountainIds[0]!] }, "south");

    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === picaId),
    ).toBe(true);
    targetPica(engine, picaId);

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(picaId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === mountainIds[1])?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace another friendly Character's effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Pica032, eb01Doma005] },
      { hand: [koPicaReview] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const picaId = engine.findCardInZone("south", "character", op05Pica032);
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(koPicaReview, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(domaId);
    expect(view.players.south.characters.some((card) => card?.instanceId === picaId)).toBe(true);
    expect(view.decisions.some((decision) => decision.title.includes("replace the K.O."))).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the replacement when battle would K.O. it", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Pica032, rested: true }, eb01MountainGod018] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const picaId = engine.findCardInZone("south", "character", op05Pica032);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, picaId, "north");
    engine.resolveDecision("battleKoReplacement", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(picaId);
    expect(view.prompts).toHaveLength(0);
  });
});
