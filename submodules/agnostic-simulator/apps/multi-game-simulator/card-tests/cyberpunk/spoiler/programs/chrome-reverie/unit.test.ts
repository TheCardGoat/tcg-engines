import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectCardPlayable,
  expectNotAttackCandidate,
  expectPendingChoice,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaRuthlessLowlife,
  alphaVCorporateExile,
  spoilerChromeReverie,
  spoilerRiverWardDetectiveOnTheHunt,
} from "@tcg/cyberpunk-cards";
import type { ActionLogEvent } from "@cyberpunk-engine/types/game-events.ts";

const chromeReverie = spoilerChromeReverie;
const rivalUnit = alphaRuthlessLowlife;
const legend = alphaVCorporateExile;
const riverWard = spoilerRiverWardDetectiveOnTheHunt;

function playChromeReverieAndTargetUnit(engine: CyberpunkTestEngine) {
  engine.playCard(chromeReverie);
  expectPendingChoice(engine, "chooseTarget");
  expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
  engine.resolveEffectTarget(rivalUnit);
}

describe("Chrome Reverie", () => {
  describe("UI prompt", () => {
    it("shows the Program as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [chromeReverie],
        eddies: chromeReverie.cost,
      });

      expectCardPlayable(engine, chromeReverie);
    });
  });

  describe("A rival Unit can't attack until your next turn. If you control a min Gig, you may Call a Legend for free.", () => {
    it("prevents the chosen rival Unit from attacking until the source player's next turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [chromeReverie],
          eddies: chromeReverie.cost,
        },
        {
          field: [{ card: rivalUnit, spent: false }],
        },
      );

      playChromeReverieAndTargetUnit(engine);

      expect(
        engine
          .getEvents("actionLog")
          .some(
            (event): event is ActionLogEvent =>
              event.messageKey === "trigger.grantRule.cantAttack" &&
              event.params.sourceCardName === chromeReverie.displayName &&
              event.params.targetNames === rivalUnit.displayName,
          ),
      ).toBe(true);

      engine.completeTurn({ as: P1 });
      expectNotAttackCandidate(engine, rivalUnit, { as: P2 });

      engine.completeTurn({ as: P2 });
      engine.completeTurn({ as: P1 });
      expectAttackCandidate(engine, rivalUnit, { as: P2 });
    });

    it("calls a face-down friendly Legend for free when the player controls a min Gig", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [chromeReverie],
          eddies: chromeReverie.cost,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
          legendArea: [{ card: legend, faceDown: true }],
        },
        {
          field: [{ card: rivalUnit, spent: false }],
        },
      );

      playChromeReverieAndTargetUnit(engine);

      const choice = expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
      expect(choice.payload.canDecline).toBe(true);

      engine.resolveEffectTarget(legend);

      expect(engine.getCard(legend, "legendArea", P1).meta.faceDown).toBe(false);
      expect(engine.getEddies(P1)).toBe(0);
      expect(engine.getState().G.players[P1].calledLegendThisTurn).toBe(true);
      expect(
        engine
          .getEvents("actionLog")
          .some(
            (event): event is ActionLogEvent =>
              event.messageKey === "effect.callLegend.free" &&
              event.params.sourceCardName === chromeReverie.displayName &&
              event.params.legendName === legend.displayName,
          ),
      ).toBe(true);
    });

    it("allows the player to decline the free Call a Legend choice", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [chromeReverie],
          eddies: chromeReverie.cost,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
          legendArea: [{ card: legend, faceDown: true }],
        },
        {
          field: [{ card: rivalUnit, spent: false }],
        },
      );

      playChromeReverieAndTargetUnit(engine);

      const result = engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);

      expect(result.success).toBe(true);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getCard(legend, "legendArea", P1).meta.faceDown).toBe(true);
      expect(engine.getState().G.players[P1].calledLegendThisTurn).toBe(false);
    });

    it("does not offer the free Call a Legend choice without a min Gig", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [chromeReverie],
          eddies: chromeReverie.cost,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
          legendArea: [{ card: legend, faceDown: true }],
        },
        {
          field: [{ card: rivalUnit, spent: false }],
        },
      );

      playChromeReverieAndTargetUnit(engine);

      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getCard(legend, "legendArea", P1).meta.faceDown).toBe(true);
    });

    it("does not offer the free Call a Legend choice after the player already called a Legend this turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [chromeReverie],
          eddies: chromeReverie.cost + 2,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
          legendArea: [
            { card: legend, faceDown: true },
            { card: riverWard, faceDown: true },
          ],
        },
        {
          field: [{ card: rivalUnit, spent: false }],
        },
      );

      engine.callLegend(legend);
      engine.playCard(chromeReverie);
      engine.resolveEffectTarget(rivalUnit);

      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getCard(riverWard, "legendArea", P1).meta.faceDown).toBe(true);
    });

    it("fires the called Legend's normal CALL ability when Chrome Reverie calls it for free", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [chromeReverie],
          eddies: chromeReverie.cost,
          gigArea: [{ dieType: "d4", faceValue: 1 }],
          legendArea: [{ card: riverWard, faceDown: true }],
          deck: 5,
        },
        {
          field: [{ card: rivalUnit, spent: false }],
        },
      );

      playChromeReverieAndTargetUnit(engine);
      const handBeforeCall = engine.getHandCount(P1);

      engine.resolveEffectTarget(riverWard);

      expect(engine.getCard(riverWard, "legendArea", P1).meta.faceDown).toBe(false);
      expect(engine.getHandCount(P1)).toBe(handBeforeCall + 1);
    });
  });
});
