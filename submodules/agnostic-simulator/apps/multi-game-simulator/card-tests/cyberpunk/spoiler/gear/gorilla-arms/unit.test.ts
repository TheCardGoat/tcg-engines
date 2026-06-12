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
  spoilerGorillaArms,
  alphaSwordwiseHuscle,
  alphaRuthlessLowlife,
  alphaTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";
import type { ActionLogEvent } from "@cyberpunk-engine/types/game-events.ts";

registerMatchers();

const gear = spoilerGorillaArms; // cost 4, power 4, gigStolen event trigger
const huscle = alphaSwordwiseHuscle; // cost 3, power 5, unit
const lowlife = alphaRuthlessLowlife; // cost 2, power 1, unit
const tBug = alphaTBugAmateurPhilosopher; // cost 3, power 5, unit

describe("Gorilla Arms", () => {
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

  describe(`The first time this Unit steals a Gig each turn, you may steal a rival Gig with the same number of sides.`, () => {
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

    it("host gains +4 power from gear", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: gear.cost,
        field: [{ card: huscle, spent: false }],
      });

      engine.attachGear(gear, huscle);
      engine.judgeRecomputeActiveEffects(); // recompute

      const instance = engine.getCard(huscle, "field", P1);
      // Huscle base 5 + gear 4 = 9
      expect(engine.getState()).toHaveEffectivePower({
        card: instance.instanceId as string,
        value: 9,
      });
    });

    it("deducts 4 eddies to equip", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: 6,
        field: [{ card: huscle, spent: false }],
      });

      engine.attachGear(gear, huscle);

      expect(engine.getEddies(P1)).toBe(2); // 6 - 4
    });

    it("fails to equip with insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [gear],
        eddies: 3,
        field: [{ card: huscle, spent: false }],
      });
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.attachGear(gear, huscle));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("card definition has a gigStolen event trigger", () => {
      const ability = gear.abilities[0]!;
      expect(ability.kind).toBe("triggered");
      expect(ability.trigger?.trigger).toBe("event");
      expect((ability.trigger as any)?.event?.event).toBe("gigStolen");
    });

    it("ability has firstTimeEachTurn limit", () => {
      const ability = gear.abilities[0]!;
      expect((ability as any).limits).toContain("firstTimeEachTurn");
    });

    it("stealGig effect uses sameSidesAs filter", () => {
      const ability = gear.abilities[0]!;
      const stealEffect = ability.effects[0]!;
      expect(stealEffect.effect).toBe("stealGig");
      expect((stealEffect as any).target.sameSidesAs).toBeDefined();
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

    it("tracks first-time triggers separately for three equipped hosts", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [],
          field: [
            { card: lowlife, spent: false, attachedGears: [gear] },
            { card: huscle, spent: false, attachedGears: [gear] },
            { card: tBug, spent: false, attachedGears: [gear] },
          ],
        },
        {
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 4 },
            { dieType: "d8", faceValue: 6 },
          ],
        },
      );

      for (const [index, dieType] of (["d4", "d6", "d8"] as const).entries()) {
        engine.judgeAddGigDie(P2, dieType, index + 3, {
          id: `gorilla-arms-extra-${dieType}`,
        });
      }

      const attacks = [
        { host: lowlife, dieType: "d4" },
        { host: huscle, dieType: "d6" },
        { host: tBug, dieType: "d8" },
      ] as const;

      const attachedGearFor = (host: (typeof attacks)[number]["host"]) => {
        const hostInst = engine.getCard(host, "field", P1);
        const gearId = hostInst.meta.attachedGearIds[0]!;
        return engine.getState().G.cardIndex[gearId as string]!;
      };

      const gearIds = attacks.map(({ host }) => attachedGearFor(host).instanceId as string);

      for (const { host, dieType } of attacks) {
        const p1Before = engine.getGigCount(P1);
        const p2Before = engine.getGigCount(P2);
        const hostGear = attachedGearFor(host);
        const directGig = engine.getGigDice(P2).find((die) => die.dieType === dieType);
        expect(directGig).toBeDefined();

        engine.attackRival(host);
        engine.resolveAttack(); // offensive → defensive
        engine.resolveAttack({ as: P2, pass: true }); // defensive → steal
        const stealResult = engine.resolveAttack({ gigIdsToSteal: [directGig!.id as string] }); // steal: take chosen gig

        expect(engine.getGigCount(P1)).toBe(p1Before + 2);
        expect(engine.getGigCount(P2)).toBe(p2Before - 2);
        expect(
          engine
            .getGigDice(P1)
            .slice(-2)
            .map((die) => die.dieType),
        ).toEqual([dieType, dieType]);
        expect(
          engine
            .getState()
            .G.turnMetadata.abilityFiredThisTurn.some(
              (entry) => entry.cardId === hostGear.instanceId && entry.abilityIndex === 0,
            ),
        ).toBe(true);
        expect(
          stealResult.moveLogs.some(
            (log) =>
              log.type === "action" &&
              log.messageKey === "trigger.stealGig" &&
              log.params.cardName === gear.displayName &&
              log.params.dieTypes === dieType,
          ),
        ).toBe(true);
      }

      const firedGearIds = engine
        .getState()
        .G.turnMetadata.abilityFiredThisTurn.map((entry) => entry.cardId as string);

      for (const gearId of gearIds) {
        expect(firedGearIds).toContain(gearId);
      }
      expect(
        engine
          .getEvents("actionLog")
          .filter((event): event is ActionLogEvent => event.type === "actionLog")
          .filter((event) => event.messageKey === "trigger.stealGig")
          .map((event) => formatActionLog(event, enMessages)),
      ).toEqual([
        "Gorilla Arms stole 1 additional d4 Gig.",
        "Gorilla Arms stole 1 additional d6 Gig.",
        "Gorilla Arms stole 1 additional d8 Gig.",
      ]);
    });

    // ── Event-filter negatives ─────────────────────────────────────────
    // The gigStolen trigger has two filter dimensions: `player: "friendly"`
    // and `source: { selector: "host" }`. Both must reject when violated.

    it("does not trigger when the rival steals a gig (player filter rejects)", () => {
      // P1 has gorilla-arms equipped on huscle. P2 attacks P1 directly and
      // steals a gig. The gigStolen event has toPlayerId === P2, so the
      // `player: "friendly"` filter (which requires toPlayerId ===
      // gorilla-arms's controller P1) rejects.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: huscle, spent: false, attachedGears: [gear] }],
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
        {
          field: [{ card: lowlife, spent: false }],
        },
      );

      const gearInst = engine.getCard(gear);

      engine.completeTurn(); // hand off to P2
      engine.attackRival(lowlife, { as: P2 });
      engine.resolveAttack({ as: P2 }); // offensive → defensive
      engine.resolveAttack({ as: P1, pass: true }); // defensive → steal
      engine.resolveAttack({ as: P2 }); // steal: take gigs

      // Gorilla-arms's ability must not have fired. firstTimeEachTurn
      // pushes onto abilityFiredThisTurn only when the trigger resolves;
      // if the filter rejected, no entry exists for the gear.
      const fired = engine
        .getState()
        .G.turnMetadata.abilityFiredThisTurn.some(
          (e) => (e.cardId as string) === (gearInst.instanceId as string),
        );
      expect(fired).toBe(false);
    });

    it("does not trigger when a different friendly unit (not the host) steals (source filter rejects)", () => {
      // P1 has TWO friendly units: huscle (with gorilla-arms equipped) and
      // lowlife (no gear). Lowlife steals — its sourceCardId is lowlife,
      // not gorilla-arms's host. The `source: { selector: "host" }` filter
      // rejects.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [
            { card: huscle, spent: false, attachedGears: [gear] },
            { card: lowlife, spent: false },
          ],
        },
        {
          gigArea: [
            { dieType: "d6", faceValue: 3 },
            { dieType: "d8", faceValue: 4 },
          ],
        },
      );

      const gearInst = engine.getCard(gear);

      engine.attackRival(lowlife);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → steal
      engine.resolveAttack(); // steal: take gigs

      const fired = engine
        .getState()
        .G.turnMetadata.abilityFiredThisTurn.some(
          (e) => (e.cardId as string) === (gearInst.instanceId as string),
        );
      expect(fired).toBe(false);
    });
  });
});
