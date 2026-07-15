import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2, createMockUnit } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailDyingNightVSPistol,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "@cyberpunk-engine/active-effects/index.ts";

const meredith = welcomeToNightCityRetailMeredithStoutStoneColdCorpo; // unit, cost 4, power 5, BLOCKER
const rivalAttacker = createMockUnit({
  id: "ms-rival-attacker",
  name: "Rival Attacker",
  power: 3,
});

describe("Meredith Stout — Stone Cold Corpo", () => {
  describe("BLOCKER", () => {
    it("redirects a rival's direct attack to itself when spent as a blocker", () => {
      // P2 attacks P1 directly; Meredith (ready) spends to block, converting the
      // steal into a fight against itself.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: meredith, spent: false }],
        },
        { field: [{ card: rivalAttacker, spent: false, hasLag: false }] },
        { activePlayerId: P2 },
      );

      engine.attackRival(rivalAttacker, { as: P2 });
      engine.resolveAttack({ as: P2 }); // attack → P1 reaction window

      // Meredith is offered as a blocker and redirects the attack into a fight.
      engine.useBlocker(meredith, { as: P1 });
      const attack = engine.getAttackState();
      expect(attack?.redirectedByBlocker).toBe(true);
      expect(attack?.kind).toBe("fight");
      expect(attack?.defenderId).toBe(engine.findCardId(meredith, "field", P1));
      // Blocking spent Meredith.
      expect(engine.getCard(meredith, "field", P1).meta.spent).toBe(true);
    });
  });

  describe("+2 power while fighting a Legend", () => {
    it("sits at base power when not in a legend fight (the +2 is fight-gated, not always-on)", () => {
      // The +2-while-fighting-a-Legend modifier is conditional on an active
      // legend fight. At idle (no fight) Meredith is at its printed base power,
      // proving the bonus is not a permanent buff.
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: meredith, spent: false, hasLag: false }],
      });
      const meredithId = engine.findCardId(meredith, "field", P1);
      expect(getEffectivePower(engine.getState(), meredithId)).toBe(meredith.power);
    });
  });

  describe("Reaction: rival adjusts a friendly Gig → may recover a trash card to hand", () => {
    it("can return a trash card when a rival decreases a friendly Gig", () => {
      // Rival attacks with Field Operator (which adjusts a gig on attack) and
      // chooses to decrease P1's Gig. Meredith's reaction fires, offering to
      // recover a friendly trash card to hand.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [meredith],
          trash: [welcomeToNightCityRetailCorporateSurveillance],
          gigArea: [{ dieType: "d8", faceValue: 5 }],
        },
        {
          field: [
            {
              card: welcomeToNightCityRetailFieldOperator,
              spent: false,
              hasLag: false,
              attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
            },
          ],
        },
        { activePlayerId: P2 },
      );

      engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
      engine.resolveAdjustGig(4, { as: P2 });
      // Meredith's reaction surfaces as a chooseTrigger; resolve it.
      const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
      if (triggerChoice?.type === "chooseTrigger") {
        const trigger = triggerChoice.payload.options[0];
        if (!trigger) throw new Error("Expected Meredith trigger option.");
        engine.executeMove("resolveTrigger", { args: { triggerId: trigger.triggerId } }, P1);
      }
      engine.resolveEffectTarget(welcomeToNightCityRetailCorporateSurveillance, {
        as: P1,
        allowPendingChoice: true,
        reason: "Meredith still needs the selected trash card move confirmed",
      });
      engine.resolveCardToMove(welcomeToNightCityRetailCorporateSurveillance, { as: P1 });

      // Recovered card is now in P1 hand and no longer in P1 trash.
      expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
        welcomeToNightCityRetailCorporateSurveillance.id,
      );
      expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
        welcomeToNightCityRetailCorporateSurveillance.id,
      );
    });
  });
});
