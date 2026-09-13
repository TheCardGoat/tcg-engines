import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05WhiteArk124 } from "./124-white-ark.ts";

function restingUnit(traits: string[], timing: "main" | "action" = "main") {
  const effect: CardEffect = {
    type: "activated",
    activation: { timing: [`activate:${timing}`] },
    directives: [
      {
        action: {
          action: "rest",
          target: { owner: "friendly", cardType: "unit", count: 1 },
        },
      },
    ],
    sourceText: `【Activate･${timing === "main" ? "Main" : "Action"}】Choose 1 friendly Unit. Rest it.`,
  };
  return createMockUnit({ name: "Resting Unit", traits, effects: [effect] });
}

describe("White Ark (GD05-124)", () => {
  /** @behavioral-proof complete: Burst acceptance/decline, Deploy shield movement, and substitution choice/trait/turn gates are public. */
  describe("【Burst】Deploy this card.", () => {
    function revealBurst() {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const otherShield = createMockUnit({ name: "Other Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [gd05WhiteArk124, otherShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected visible Burst choice");

      return { p2, burst };
    }

    it("deploys White Ark and adds the top remaining Shield to hand when accepted", () => {
      const { p2, burst } = revealBurst();

      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      // Rule 4-6-4-1: "Add 1 of your Shields" takes the top Shield — no choice.
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getHand()).toHaveLength(1);
    });

    it("puts White Ark in trash and leaves the other Shield when declined", () => {
      const { p2, burst } = revealBurst();

      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(1);
      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });

  it("adds the top Shield to hand when normally deployed", () => {
    const topShield = createMockUnit({ name: "Top Shield" });
    const bottomShield = createMockUnit({ name: "Bottom Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd05WhiteArk124],
      shieldArea: [topShield, bottomShield],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [topShieldId, bottomShieldId] = p1.getCardsInZone("shieldArea");

    expectSuccess(p1.deployBase(gd05WhiteArk124));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(gd05WhiteArk124)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardZone(topShieldId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(bottomShieldId!)).toBe(`shieldArea:${PLAYER_ONE}`);
  });

  function substitutionSetup(sourceTraits: string[]) {
    const source = restingUnit(sourceTraits);
    const target = createMockUnit({ name: "Unit to rest" });
    const engine = GundamTestEngine.create({
      baseSection: [gd05WhiteArk124],
      play: [source, target],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [sourceId, targetId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.activateAbility(sourceId!, 0, { targets: [targetId!] }));

    return { p1, sourceId: sourceId!, targetId: targetId!, baseId };
  }

  it("may rest White Ark instead of the Unit chosen by a League Militaire Unit effect", () => {
    const { p1, targetId, baseId } = substitutionSetup(["league militaire"]);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [targetId, baseId],
    });

    expectSuccess(p1.resolveEffect({ targets: [baseId] }));

    expect(p1.isExhausted(baseId)).toBe(true);
    expect(p1.isExhausted(targetId)).toBe(false);
  });

  it("may decline the substitution by choosing the original Unit", () => {
    const { p1, targetId, baseId } = substitutionSetup(["league militaire"]);

    expectSuccess(p1.resolveEffect({ targets: [targetId] }));

    expect(p1.isExhausted(baseId)).toBe(false);
    expect(p1.isExhausted(targetId)).toBe(true);
  });

  it("does not offer substitution for a non-League Militaire Unit effect", () => {
    const { p1, targetId, baseId } = substitutionSetup(["earth federation"]);

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.isExhausted(baseId)).toBe(false);
    expect(p1.isExhausted(targetId)).toBe(true);
  });

  it("does not offer substitution during the opponent's turn", () => {
    const source = restingUnit(["league militaire"], "action");
    const target = createMockUnit({ name: "Unit to rest" });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd05WhiteArk124],
        play: [source, target],
      },
      {},
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sourceId, targetId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p2.passPhase());
    expectSuccess(p1.activateAbility(sourceId!, 0, { targets: [targetId!] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.isExhausted(baseId)).toBe(false);
    expect(p1.isExhausted(targetId!)).toBe(true);
  });
});
