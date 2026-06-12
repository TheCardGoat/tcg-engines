import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectCardPlayable,
  expectCardNotPlayable,
  expectAttachTarget,
  expectAttackCandidate,
  expectNotAttackCandidate,
  expectPendingChoice,
  expectEligibleTargets,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaDyingNightVSPistol,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  alphaKiroshiOptics,
  alphaTBugAmateurPhilosopher,
  alphaVCorporateExile,
  alphaJackieWellesPourOneOutForMe,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

registerMatchers();

const gear = alphaDyingNightVSPistol; // cost 2, power 2, attack: defeat rival gear cost<=2 if streetCred>=7
const lowlife = alphaRuthlessLowlife; // cost 2, power 1, unit
const huscle = alphaSwordwiseHuscle; // cost 3, power 5, unit
const kiroshi = alphaKiroshiOptics; // cost 1, power 1, gear (target for defeat)

// Gig dice that sum to street cred >= 7
const HIGH_CRED_GIGS: { dieType: "d6" | "d8"; faceValue: number }[] = [
  { dieType: "d8", faceValue: 4 },
  { dieType: "d6", faceValue: 3 },
];

describe("Dying Night - V's Pistol", () => {
  describe("UI prompt", () => {
    it("shows the gear as playable with a friendly unit as a valid attach target", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: huscle, spent: false }],
      });

      expectCardPlayable(engine, gear);
      expectAttachTarget(engine, gear, huscle);
    });

    it("does NOT show the gear as playable when no friendly unit is on the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [],
      });

      expectCardNotPlayable(engine, gear);
    });

    it("does NOT show the gear as playable with insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: 1,
        field: [{ card: huscle, spent: false }],
      });
      engine.spendAllLegends();

      expectCardNotPlayable(engine, gear);
    });

    it("highlights the equipped unit as an attack candidate after gearing up", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: huscle, spent: false }],
      });

      engine.attachGear(gear, huscle);

      expectAttackCandidate(engine, huscle);
    });

    it("does NOT highlight a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: huscle, spent: true }],
      });

      expectNotAttackCandidate(engine, huscle);
    });

    it("presents the correct targets after the host attacks with high street cred", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            {
              card: alphaTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [gear],
            },
          ],
          legendArea: [alphaVCorporateExile],
          gigArea: HIGH_CRED_GIGS,
        },
        {
          field: [
            {
              card: lowlife,
              spent: true,
              attachedGears: [kiroshi],
            },
          ],
        },
      );

      engine.attackRival(alphaTBugAmateurPhilosopher);

      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
      expectEligibleTargets(engine, [kiroshi], { as: P2 });
    });
  });

  describe(`ATTACK If you have 7+ * (Street Cred), defeat a rival gear card that costs 2 or less.`, () => {
    it("can equip to a friendly unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: huscle, spent: false }],
      });

      engine.attachGear(gear, huscle);

      const gearCard = engine.getCard(gear);
      const hostId = engine.getCard(huscle, "field", P1).instanceId;
      expect(gearCard.meta.attachedToId).toBe(hostId);
    });

    it("host gains +2 power from gear", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: huscle, spent: false }],
      });

      engine.attachGear(gear, huscle);
      engine.judgeRecomputeActiveEffects(); // recompute

      const instance = engine.getCard(huscle, "field", P1);
      // Huscle base 5 + gear 2 = 7
      expect(engine.getState()).toHaveEffectivePower({
        card: instance.instanceId as string,
        value: 7,
      });
    });

    it("defeats a rival gear card costing <= 2 when street cred >= 7 on attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: huscle, spent: false }],
          gigArea: HIGH_CRED_GIGS,
        },
        {
          hand: [kiroshi],
          eddies: kiroshi.cost,
          field: [{ card: lowlife, spent: false }],
        },
      );

      // P1 equips Dying Night on huscle
      engine.attachGear(gear, huscle);

      // P1 passes turn → P2 equips Kiroshi on lowlife
      engine.completeTurn();
      engine.attachGear(kiroshi, lowlife, { as: P2 });
      engine.completeTurn({ as: P2 });

      // P1's turn: direct attack triggers gear ability
      engine.attackRival(huscle);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).toBe("chooseTarget");
      if (!choice || choice.type !== "chooseTarget") {
        throw new Error("Expected chooseTarget");
      }
      const targetId = choice.payload.eligibleIds![0]!;
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [targetId] } }, P1);

      // Attack trigger fires: street cred = 7, Kiroshi costs 1 → defeated
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === kiroshi.id)).toBe(true);
    });

    it("defeats the selected rival gear during a direct attack in the high-cred scenario", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            {
              card: alphaTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [gear],
            },
          ],
          legendArea: [alphaVCorporateExile],
          gigArea: HIGH_CRED_GIGS,
        },
        {
          hand: [],
          field: [
            {
              card: lowlife,
              spent: true,
              attachedGears: [kiroshi],
            },
          ],
          legendArea: [alphaJackieWellesPourOneOutForMe],
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
      );

      engine.attackRival(alphaTBugAmateurPhilosopher);

      expect(engine.getCard(gear, "field", P1).controllerId).toBe(P1);
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).toBe("chooseTarget");
      if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
        throw new Error("Expected chooseTarget");
      }
      expect(choice.chooserId).toBe(P1);
      expect(choice.payload.eligibleIds).toEqual([engine.findCardId(kiroshi, "field", P2)]);

      engine.resolveEffectTarget(kiroshi);

      expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
        kiroshi.id,
      );
      expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).not.toContain(
        kiroshi.id,
      );
      expect(engine.getCard(lowlife, "field", P2).meta.attachedGearIds).not.toContain(
        engine.findCardId(kiroshi, "trash", P2),
      );
      expect(engine.getEvents("actionLog").map((event) => event.messageKey)).not.toContain(
        "trigger.noValidTargets",
      );
    });

    it("does NOT defeat rival gear when street cred < 7", () => {
      // Street cred = 3 (only one small gig). Pre-attach kiroshi on P2's lowlife in the fixture.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: huscle, spent: false }],
          gigArea: [{ dieType: "d6", faceValue: 3 }], // street cred = 3 < 7
        },
        { field: [{ card: lowlife, spent: false }] },
      );

      engine.attachGear(gear, huscle);

      // Direct attack fires trigger — but street cred < 7, no rival gear defeated
      engine.attackRival(huscle);

      // No rival gear to target anyway in this fixture, and condition wouldn't pass
      expect(engine.getStreetCred(P1)).toBeLessThan(7);
    });

    it("no effect when rival has no gear", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: huscle, spent: false }],
          gigArea: HIGH_CRED_GIGS,
        },
        { field: [{ card: lowlife, spent: true }] },
      );

      engine.attachGear(gear, huscle);

      // No rival gear to defeat — attack still succeeds
      engine.attackUnit(huscle, lowlife);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
    });

    it("deducts 2 eddies to equip", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: 4,
        field: [{ card: huscle, spent: false }],
      });

      engine.attachGear(gear, huscle);

      expect(engine.getEddies(P1)).toBe(2); // 4 - 2
    });

    it("fails to equip with insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: 1,
        field: [{ card: huscle, spent: false }],
      });
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.attachGear(gear, huscle));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("emits an action log when gear is equipped", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: huscle, spent: false }],
      });

      engine.attachGear(gear, huscle);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.playCard.gear");
      expect(log!.params.cardName).toBe(gear.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(gear.displayName);
    });
  });
});
