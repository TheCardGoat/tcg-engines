import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "../../index.ts";

const optionalFilteredDiscard: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [
    {
      optional: true,
      action: {
        action: "discard",
        count: 1,
        filter: {
          owner: "friendly",
          zone: "hand",
          cardType: "unit",
          count: 1,
          attributeFilters: [
            { attribute: "color", comparison: "eq", value: "green" },
            { attribute: "trait", comparison: "includes", value: "earth federation" },
          ],
        },
      },
    },
  ],
  sourceText: "You may discard 1 green Earth Federation Unit card.",
};

describe("pending effects — filtered discard choice", () => {
  it("asks the player which eligible hand card to discard after accepting", () => {
    const source = createMockUnit({
      name: "Discard Source",
      level: 1,
      cost: 1,
      effects: [optionalFilteredDiscard],
    });
    const firstEligible = createMockUnit({
      name: "First Eligible",
      color: "green",
      traits: ["earth federation"],
    });
    const secondEligible = createMockUnit({
      name: "Second Eligible",
      color: "green",
      traits: ["earth federation"],
    });
    const ineligible = createMockUnit({
      name: "Ineligible",
      color: "green",
      traits: ["zeon"],
    });
    const engine = GundamTestEngine.create({
      hand: [source, firstEligible, secondEligible, ineligible],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [, firstEligibleId, secondEligibleId, ineligibleId] = p1.getHand();

    expectSuccess(p1.deployUnit(source));
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [firstEligibleId, secondEligibleId],
    });
    expectFailure(p1.resolveEffect({ targets: [ineligibleId!] }), "ILLEGAL_TARGET");
    expect(p1.getCardsInZone("trash")).toHaveLength(0);

    expectSuccess(p1.resolveEffect({ targets: [secondEligibleId!] }));

    expect(p1.getCardsInZone("trash")).toEqual([secondEligibleId]);
    expect(p1.getHand()).toEqual(expect.arrayContaining([firstEligibleId, ineligibleId]));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
