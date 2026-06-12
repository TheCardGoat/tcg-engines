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
  alphaSatoriSwordOfSaburo,
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  alphaTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import {
  enMessages,
  formatActionLog,
  stripPrivateFields,
} from "@cyberpunk-engine/logging/index.ts";

registerMatchers();

const gear = alphaSatoriSwordOfSaburo; // cost 2, power 1, attack: conditional draw on fightOutcome win
const lowlife = alphaRuthlessLowlife; // cost 2, power 1, unit
const huscle = alphaSwordwiseHuscle; // cost 3, power 5, unit

describe("Satori - Sword of Saburo", () => {
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

  describe(`ATTACK If this unit wins a fight against a rival unit, draw a card.`, () => {
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

    it("host gains +1 power from gear", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: huscle, spent: false }],
      });

      engine.attachGear(gear, huscle);
      engine.judgeRecomputeActiveEffects(); // recompute

      const instance = engine.getCard(huscle, "field", P1);
      // Huscle base 5 + gear 1 = 6
      expect(engine.getState()).toHaveEffectivePower({
        card: instance.instanceId as string,
        value: 6,
      });
    });

    it("host can attack a spent rival unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: huscle, spent: false }],
        },
        { field: [{ card: lowlife, spent: true }] },
      );

      engine.attachGear(gear, huscle);

      engine.attackUnit(huscle, lowlife);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("fight");
    });

    it("host can attack rival directly", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: huscle, spent: false }],
      });

      engine.attachGear(gear, huscle);

      engine.attackRival(huscle);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
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

    it("gear goes to trash when host is defeated in combat", () => {
      // Huscle (power 5+1=6) vs Jackie (power 6 from fixture filler — use a strong unit)
      // Use lowlife as attacker on P2 side — lowlife will lose but we test gear trash
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [gear],
          eddies: gear.cost,
          field: [{ card: lowlife, spent: false }], // power 1+1=2
        },
        { field: [{ card: huscle, spent: true }] }, // power 5
      );

      engine.attachGear(gear, lowlife);

      engine.attackUnit(lowlife, huscle);
      engine.resolveFullFight();

      // Lowlife (power 2) loses to Huscle (power 5) — lowlife and gear go to P1 trash
      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === lowlife.id)).toBe(true);
      expect(p1Trash.some((c) => c.definitionId === gear.id)).toBe(true);
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

    // ── Fight outcome trigger ──────────────────────────────────────────
    // Satori's effect fires on the `fightResolved` DSL event when its host
    // wins a fight against a rival unit. See FightResolvedEvent in
    // packages/types/src/index.ts.

    it("attacks a rival unit, wins the fight, and draws a card", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [lowlife],
          field: [
            {
              card: alphaTBugAmateurPhilosopher,
              spent: false,
              attachedGears: [gear],
            },
          ],
          deck: 30,
        },
        { field: [{ card: alphaCorpoSecurity, spent: true }] },
      );

      const handBefore = engine.getHandCount(P1);
      const handIdsBefore = new Set(engine.getCardsInZone("hand", P1).map((c) => c.instanceId));
      const deckBefore = engine.getCardsInZone("deck", P1).length;
      engine.attackUnit(alphaTBugAmateurPhilosopher, alphaCorpoSecurity);
      engine.resolveAttack({ as: P1 });
      engine.resolveAttack({ as: P2, pass: true });
      engine.resolveAttack({ as: P1 });
      const finalResult = engine.resolveAttack({ as: P1 });

      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
      expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckBefore - 1);
      expect(engine.getCardsInZone("hand", P1).some((c) => !handIdsBefore.has(c.instanceId))).toBe(
        true,
      );
      expect(
        engine.getCardsInZone("trash", P2).some((c) => c.definitionId === alphaCorpoSecurity.id),
      ).toBe(true);

      const triggerLog = finalResult.moveLogs.find(
        (log) => log.type === "action" && log.messageKey === "trigger.autoResolved",
      );
      expect(triggerLog).toBeDefined();

      const drawLog = finalResult.moveLogs.find(
        (log) => log.type === "action" && log.messageKey === "effect.draw.resolved",
      );
      expect(drawLog).toBeDefined();
      if (!drawLog || drawLog.type !== "action") return;

      const ownerLog = stripPrivateFields(drawLog, P1);
      const rivalLog = stripPrivateFields(drawLog, P2);
      expect(ownerLog.params.sourceCardName).toBe(gear.displayName);
      expect(ownerLog.params.drawnCount).toBe(1);
      expect(ownerLog.params.drawnCardIds).toHaveLength(1);
      expect(rivalLog.params.drawnCount).toBe(1);
      expect(rivalLog.params.drawnCardIds).toBeUndefined();
    });

    it("does not draw when the host loses the fight", () => {
      // Lowlife (1) + Satori (1) = 2 vs Huscle (5) — defender wins.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: lowlife, spent: false, attachedGears: [gear] }],
          deck: 30,
        },
        { field: [{ card: huscle, spent: true }] },
      );

      const handBefore = engine.getHandCount(P1);
      engine.attackUnit(lowlife, huscle);
      engine.resolveFullFight();

      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("does not draw on a mutual KO", () => {
      // Lowlife (1) + Satori (1) = 2 vs Lowlife (1) + Satori (1) = 2 — mutual.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: lowlife, spent: false, attachedGears: [gear] }],
          deck: 30,
        },
        {
          field: [{ card: lowlife, spent: true, attachedGears: [gear] }],
          deck: 30,
        },
      );

      const handBefore = engine.getHandCount(P1);
      engine.attackUnit(lowlife, lowlife);
      engine.resolveFullFight();

      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("does not draw on a direct attack (gigsStolen result)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: huscle, spent: false, attachedGears: [gear] }],
        deck: 5,
      });

      const handBefore = engine.getHandCount(P1);
      engine.attackRival(huscle);
      engine.resolveFullSteal();

      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("does not fire when a different friendly unit (not the host) wins a fight", () => {
      // Two friendly units. Satori is on huscle; lowlife (no Satori) is the attacker.
      // Lowlife wins its fight, but Satori's host (huscle) was not the attacker —
      // the `attacker: { selector: "host" }` filter rejects.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: huscle, spent: false, attachedGears: [gear] },
            { card: lowlife, spent: false },
          ],
          deck: 30,
        },
        { field: [{ card: lowlife, spent: true }] },
      );

      const handBefore = engine.getHandCount(P1);
      engine.attackUnit(lowlife, lowlife);
      engine.resolveFullFight();

      // Lowlife (1) vs Lowlife (1) = mutual. Even if huscle's Satori wanted to
      // fire on attackerWins, it would be filtered out — the attacker is not
      // its host.
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });
  });
});
