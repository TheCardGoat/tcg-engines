import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05Archangel123 } from "./123-archangel.ts";

function damageCommand(amount: number, timing: "main" | "action" = "main") {
  return createMockCommand({
    name: `${amount} Damage Command`,
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: [timing] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【${timing === "main" ? "Main" : "Action"}】Deal ${amount} damage.`,
      },
    ],
  });
}

describe("Archangel (GD05-123)", () => {
  /** @behavioral-proof complete: Burst acceptance/decline, Deploy shield movement, and every prevention gate are public. */
  describe("【Burst】Deploy this card.", () => {
    function revealBurst() {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const otherShield = createMockUnit({ name: "Other Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [gd05Archangel123, otherShield] },
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

    it("deploys Archangel and adds the top remaining Shield to hand when accepted", () => {
      const { p2, burst } = revealBurst();

      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      // Rule 4-6-4-1: "Add 1 of your Shields" takes the top Shield — no choice.
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getHand()).toHaveLength(1);
    });

    it("puts Archangel in trash and leaves the other Shield when declined", () => {
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
      hand: [gd05Archangel123],
      shieldArea: [topShield, bottomShield],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [topShieldId, bottomShieldId] = p1.getCardsInZone("shieldArea");

    expectSuccess(p1.deployBase(gd05Archangel123));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(gd05Archangel123)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardZone(topShieldId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(bottomShieldId!)).toBe(`shieldArea:${PLAYER_ONE}`);
  });

  it("prevents enemy effect damage of 2 or less to Orb Units, but not larger damage or non-Orb Units", () => {
    const twoToOrb = damageCommand(2);
    const twoToOther = damageCommand(2);
    const threeToOrb = damageCommand(3);
    const orb = createMockUnit({ name: "Orb Unit", traits: ["orb"], hp: 10 });
    const other = createMockUnit({ name: "Other Unit", traits: ["earth federation"], hp: 10 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd05Archangel123],
        play: [orb, other],
      },
      {
        hand: [twoToOrb, twoToOther, threeToOrb],
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [orbId, otherId] = p1.getCardsInZone("battleArea");

    expectSuccess(p2.playCommand(twoToOrb, { targets: [orbId!] }));
    expectSuccess(p2.playCommand(twoToOther, { targets: [otherId!] }));
    expectSuccess(p2.playCommand(threeToOrb, { targets: [orbId!] }));

    expect(p1.getDamage(orbId!)).toBe(3);
    expect(p1.getDamage(otherId!)).toBe(2);
  });

  it("does not prevent enemy effect damage during Archangel's controller's turn", () => {
    const actionDamage = damageCommand(2, "action");
    const orb = createMockUnit({ name: "Orb Unit", traits: ["orb"], hp: 10 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd05Archangel123],
        play: [orb],
      },
      { hand: [actionDamage] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const orbId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.playCommand(actionDamage, { targets: [orbId] }));

    expect(p1.getDamage(orbId)).toBe(2);
  });
});
