import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCardPlayable,
  expectPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  spoilerAltCunninghamSoulkillerArchitect,
  alphaCorporateSurveillance,
  alphaRebootOptics,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const alt = spoilerAltCunninghamSoulkillerArchitect;
const corpSurv = alphaCorporateSurveillance; // program, cost 2
const reboot = alphaRebootOptics; // program, cost 2
const huscle = alphaSwordwiseHuscle; // unit, power 5
const p1LeadGigs = [
  { dieType: "d4" as const, faceValue: 1 },
  { dieType: "d8" as const, faceValue: 1 },
];

describe("Alt Cunningham - Soulkiller Architect", () => {
  describe("UI prompt", () => {
    it("shows the program as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alt],
        eddies: alt.cost,
      });
      expectCardPlayable(engine, alt);
    });

    it("presents a chooseCardToPlay choice after stealing a gig", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: alt, spent: false, faceDown: false }],
          trash: [corpSurv],
          eddies: 20,
          gigArea: p1LeadGigs,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );
      engine.attackRival(alt);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      const choice = expectPendingChoice(engine, "chooseCardToPlay");
      expect(choice.payload.free).toBe(true);
    });
  });

  // ── GO SOLO ──────────────────────────────────────────────────────────

  describe(`GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)`, () => {
    it("enters the field as a ready unit with no summoning sickness", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alt, spent: false }],
      });

      engine.attackRival(alt);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
    });

    it("spends Alt when she attacks", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alt, spent: false }],
      });

      engine.attackRival(alt);

      expect(engine.getCard(alt).meta.spent).toBe(true);
    });

    it("cannot attack when spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alt, spent: true }],
      });

      const failure = engine.expectFailure(() => engine.attackRival(alt));
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("emits a localised action log for the direct attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: alt, spent: false }],
      });

      engine.attackRival(alt);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.attackRival");
      expect(log!.params.attackerName).toBe(alt.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(alt.displayName);
    });
  });

  // ── TRIGGERED ABILITY ───────────────────────────────────────────────

  describe(`When this Legend steals a Gig, you may remove this Legend from the game. If you do, choose a Program from your trash. Play it for free.`, () => {
    function setupForGigSteal(
      extraP1?: Partial<Parameters<typeof CyberpunkTestEngine.createWithFixture>[0]>,
    ) {
      return CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: alt, spent: false, faceDown: false }],
          trash: [corpSurv],
          eddies: 20,
          gigArea: p1LeadGigs,
          ...extraP1,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );
    }

    it("triggers when Alt steals a gig via direct attack — sets a chooseCardToPlay pending choice", () => {
      const engine = setupForGigSteal();

      engine.attackRival(alt);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseCardToPlay");
    });

    it("Alt is removed from the game after the ability fires", () => {
      const engine = setupForGigSteal();

      engine.attackRival(alt);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      // Alt should be removed from cardIndex entirely
      const allCards = Object.values(engine.getState().G.cardIndex);
      const altInstances = allCards.filter((c) => c.definitionId === alt.id);
      expect(altInstances).toHaveLength(0);
    });

    it("plays a program from trash for free after resolving the choice", () => {
      const engine = setupForGigSteal();

      engine.attackRival(alt);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      // Pending choice should offer the program in trash
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice!.type).toBe("chooseCardToPlay");
      expect((choice as any).payload.free).toBe(true);

      const eddiesBefore = engine.getEddies(P1);
      engine.resolveCardToPlay(corpSurv);

      // Program is a one-shot: it goes to trash after playing
      const corpSurvCard = engine.getCard(corpSurv, "trash", P1);
      expect(corpSurvCard).toBeDefined();

      // No eddies spent (played for free)
      expect(engine.getEddies(P1)).toBe(eddiesBefore);
    });

    it("stolen gig is in P1's gig area after the ability resolves", () => {
      const engine = setupForGigSteal();
      const p2GigsBefore = engine.getGigCount(P2);

      engine.attackRival(alt);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      expect(engine.getGigCount(P1)).toBeGreaterThanOrEqual(1);
      expect(engine.getGigCount(P2)).toBe(p2GigsBefore - 1);
    });

    it("does not trigger when a different friendly unit steals a gig (source: self)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: alt, faceDown: false }],
          field: [{ card: huscle, spent: false }],
          trash: [corpSurv],
          eddies: 20,
          gigArea: p1LeadGigs,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );

      engine.attackRival(huscle);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      // No pending choice — Alt's ability should NOT have fired
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeUndefined();

      // Alt should still exist (not removed)
      const allCards = Object.values(engine.getState().G.cardIndex);
      const altInstances = allCards.filter((c) => c.definitionId === alt.id);
      expect(altInstances.length).toBeGreaterThan(0);
    });

    it("does not trigger when the rival has no gigs to steal", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: alt, spent: false, faceDown: false }],
          trash: [corpSurv],
          eddies: 20,
        },
        {
          // No gig area — nothing to steal
        },
      );

      engine.attackRival(alt);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      // No pending choice (no gigs stolen → trigger didn't fire)
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeUndefined();
    });

    it("does not set a pending choice when no programs are in trash", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: alt, spent: false, faceDown: false }],
          // No programs in trash
          eddies: 20,
          gigArea: p1LeadGigs,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );

      engine.attackRival(alt);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      // Alt is still removed (the doEffect fires unconditionally)
      const allCards = Object.values(engine.getState().G.cardIndex);
      const altInstances = allCards.filter((c) => c.definitionId === alt.id);
      expect(altInstances).toHaveLength(0);

      // But no pending choice since there are no programs in trash
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeUndefined();
    });

    it("offers multiple programs when more than one is in trash", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: alt, spent: false, faceDown: false }],
          trash: [corpSurv, reboot],
          eddies: 20,
          gigArea: p1LeadGigs,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );

      engine.attackRival(alt);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseCardToPlay");
      expect((choice as any).payload.cardIds.length).toBe(2);
    });

    it("emits action logs for the gig steal", () => {
      const engine = setupForGigSteal();

      engine.attackRival(alt);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      // The last action log should be from the direct attack resolution
      const logs = engine.getEvents("actionLog");
      const stealLog = logs.find((l: any) => l.messageKey === "move.resolveAttack.direct");
      expect(stealLog).toBeDefined();
      const text = formatActionLog(stealLog as any, enMessages);
      expect(text).toContain(alt.displayName);
      expect(text).toContain("stole");
    });

    it("does not trigger when Alt is face-down in the legend area", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [alt], // face-down by default
          field: [{ card: huscle, spent: false }],
          trash: [corpSurv],
          eddies: 20,
          gigArea: p1LeadGigs,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );

      engine.attackRival(huscle);
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive → resolve
      engine.resolveAttack(); // steal: steal gigs

      // Face-down legends have inactive triggered abilities
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeUndefined();
    });
  });
});
