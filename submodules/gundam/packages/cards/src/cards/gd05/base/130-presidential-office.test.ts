import type { CardEffect } from "@tcg/gundam-types";
import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectBaseBurstAndDeployAbilities } from "../../../test-helpers/base-behavior-test-helpers.ts";
import { gd05PresidentialOffice130 } from "./130-presidential-office.ts";

function baseDamageSource(amount: number) {
  const effect: CardEffect = {
    type: "activated",
    activation: { timing: ["activate:main"] },
    directives: [
      {
        action: {
          action: "dealDamage",
          amount,
          target: {
            owner: "opponent",
            count: 1,
            attributeFilters: [{ attribute: "zone", comparison: "eq", value: "baseSection" }],
          },
        },
      },
    ],
    sourceText: `【Activate・Main】Deal ${amount} damage to 1 enemy Base.`,
  };
  return createMockUnit({ name: "Base Damage Source", effects: [effect] });
}

describe("Presidential Office (GD05-130)", () => {
  it("executes its Burst deployment and Deploy Shield ability", () => {
    expectBaseBurstAndDeployAbilities(gd05PresidentialOffice130);
  });

  /** @behavioral-proof complete: destroyed trigger, optional self-exile, and named Base deployment. */
  it("【Destroyed】 lets its owner accept self-exile, then select only a named Base from hand", () => {
    const replacement = { ...gd05PresidentialOffice130, id: "GD05-130-replacement" };
    const invalidBase = createMockBase({ name: "White Base" });
    const engine = GundamTestEngine.create(
      { play: [baseDamageSource(5)] },
      { baseSection: [gd05PresidentialOffice130], hand: [replacement, invalidBase] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const destroyedId = p2.getCardsInZone("baseSection")[0]!;
    const replacementId = p2.getHand()[0]!;
    const invalidBaseId = p2.getHand()[1]!;

    expectSuccess(p1.activateAbility(sourceId, 0));
    expectSuccess(p1.resolveEffect({ targets: [destroyedId] }));

    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "optional") throw new Error("Expected the self-exile choice");
    expect(choice).toMatchObject({ sourceCardId: destroyedId, directiveIndex: 0 });
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expectFailure(p1.resolveEffect({ optionalAnswers: { 0: true } }), "NOT_ACTIVE_PLAYER");

    expectSuccess(p2.resolveEffect({ optionalAnswers: { 0: true } }));
    const targetChoice = p2.getBoardView().pendingChoice;
    if (targetChoice?.kind !== "targetSelection") {
      throw new Error("Expected the named Base target choice after accepting self-exile");
    }
    expect(targetChoice.legalTargetIds).toEqual([replacementId]);
    expect(targetChoice.legalTargetIds).not.toContain(invalidBaseId);
    expectSuccess(p2.resolveEffect({ optionalAnswers: { 1: true }, targets: [replacementId] }));

    expect(p2.getCardZone(destroyedId)).toBe("removalArea");
    expect(p2.getCardZone(replacementId)).toBe(`baseSection:${PLAYER_TWO}`);
    expect(p2.getCardZone(invalidBaseId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("leaves the destroyed Base in trash and does not deploy a replacement when self-exile is declined", () => {
    const replacement = { ...gd05PresidentialOffice130, id: "GD05-130-declined-replacement" };
    const engine = GundamTestEngine.create(
      { play: [baseDamageSource(5)] },
      { baseSection: [gd05PresidentialOffice130], hand: [replacement] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const destroyedId = p2.getCardsInZone("baseSection")[0]!;
    const replacementId = p2.getHand()[0]!;

    expectSuccess(p1.activateAbility(sourceId, 0));
    expectSuccess(p1.resolveEffect({ targets: [destroyedId] }));
    expectSuccess(p2.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p2.getCardZone(destroyedId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardZone(replacementId)).toBe(`hand:${PLAYER_TWO}`);
  });
});
