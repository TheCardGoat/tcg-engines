import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectCardPlayable,
  expectCardNotPlayable,
  expectAttachTarget,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaMandibularUpgrade,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

registerMatchers();

const gear = alphaMandibularUpgrade; // cost 1, power 0, keyword: blocker
const lowlife = alphaRuthlessLowlife; // cost 2, power 1, unit
const huscle = alphaSwordwiseHuscle; // cost 3, power 5, unit

describe("Mandibular Upgrade", () => {
  describe("UI prompt", () => {
    it("shows the gear as playable with a valid attach target", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false }],
      });
      expectCardPlayable(engine, gear);
      expectAttachTarget(engine, gear, lowlife);
    });

    it("does NOT show the gear as playable without a valid target", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [],
      });
      expectCardNotPlayable(engine, gear);
    });
  });

  describe(`BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)`, () => {
    it("can equip to a friendly unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.attachGear(gear, lowlife);

      const gearCard = engine.getCard(gear);
      const hostId = engine.getCard(lowlife, "field", P1).instanceId;
      expect(gearCard.meta.attachedToId).toBe(hostId);
    });

    it("host gains +0 power (gear power is 0)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.attachGear(gear, lowlife);
      engine.judgeRecomputeActiveEffects(); // recompute

      const instance = engine.getCard(lowlife, "field", P1);
      // Lowlife base power 1, gear power 0, effective = 1
      expect(engine.getState()).toHaveEffectivePower({
        card: instance.instanceId as string,
        value: 1,
      });
    });

    it("host with gear can block a rival's direct attack", () => {
      // P1 has lowlife equipped with Mandibular Upgrade. P2 has huscle.
      // P1 equips gear, passes turn. P2 attacks, P1 blocks.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: lowlife, spent: false }],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.attachGear(gear, lowlife);
      engine.completeTurn(); // P1 turn ends, P2 turn starts

      // P2's turn: attack directly
      engine.passPhase({ as: P2 }); // play → attack
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 }); // offensive → defensive

      // P1 blocks with lowlife
      engine.useBlocker(lowlife, { as: P1 });

      const attack = engine.getAttackState();
      expect(attack!.kind).toBe("fight");
    });

    it("host is spent when activated as a blocker", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: lowlife, spent: false }],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.attachGear(gear, lowlife);
      engine.completeTurn();

      engine.passPhase({ as: P2 });
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 });
      engine.useBlocker(lowlife, { as: P1 });

      expect(engine.getCard(lowlife, "field", P1).meta.spent).toBe(true);
    });

    it("spent host cannot block", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: lowlife, spent: false }],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.attachGear(gear, lowlife);
      engine.judgeSpendCard(lowlife, { as: P1 });
      engine.completeTurn();

      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 });

      const failure = engine.expectFailure(() => engine.useBlocker(lowlife, { as: P1 }));
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("deducts 1 eddie to equip", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: 3,
        field: [{ card: lowlife, spent: false }],
      });

      engine.attachGear(gear, lowlife);

      expect(engine.getEddies(P1)).toBe(2); // 3 - 1
    });

    it("fails to equip with insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: 0,
        field: [{ card: lowlife, spent: false }],
      });
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.attachGear(gear, lowlife));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("emits an action log when gear is equipped", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: lowlife, spent: false }],
      });

      engine.attachGear(gear, lowlife);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.playCard.gear");
      expect(log!.params.cardName).toBe(gear.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(gear.displayName);
    });

    it("emits a blocker action log when host blocks", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: lowlife, spent: false }],
        },
        { field: [{ card: huscle, spent: false }] },
      );

      engine.attachGear(gear, lowlife);
      engine.completeTurn();

      engine.passPhase({ as: P2 });
      engine.attackRival(huscle, { as: P2 });
      engine.resolveAttack({ as: P2 });
      engine.useBlocker(lowlife, { as: P1 });

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.useBlocker");
      expect(log!.params.blockerName).toBe(lowlife.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(lowlife.displayName);
    });
  });
});
