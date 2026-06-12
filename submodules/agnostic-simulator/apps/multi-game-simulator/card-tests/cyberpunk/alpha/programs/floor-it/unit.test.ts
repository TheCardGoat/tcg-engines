import { describe, expect, it } from "vite-plus/test";
import type { CardZone, StructuredCardDefinition } from "@tcg/cyberpunk-types";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCardPlayable,
  expectPendingChoice,
  expectEligibleTargets,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaCorpoSecurity,
  alphaFloorIt,
  alphaJackieWellesRideOrDieChoom,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";
import type { PlayerId } from "@cyberpunk-engine/types/branded.ts";

const program = alphaFloorIt; // cost 3, program
const corpo = alphaCorpoSecurity; // cost 2, unit
const lowlife = alphaRuthlessLowlife; // cost 2, unit
const huscle = alphaSwordwiseHuscle; // cost 3, unit
const jackie = alphaJackieWellesRideOrDieChoom; // cost 6, unit

function floorItFixture(
  p1: Parameters<typeof CyberpunkTestEngine.createWithFixture>[0] = {},
  p2: Parameters<typeof CyberpunkTestEngine.createWithFixture>[1] = {},
): CyberpunkTestEngine {
  return CyberpunkTestEngine.createWithFixture(
    { hand: [program], eddies: program.cost, ...p1 },
    p2,
  );
}

function floorItChoice(engine: CyberpunkTestEngine) {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
    throw new Error("Expected Floor It target choice");
  }
  expect(choice.payload.type).toBe("effectTarget");
  return choice;
}

function eligibleDefinitions(engine: CyberpunkTestEngine): string[] {
  return (floorItChoice(engine).payload.eligibleIds ?? []).map(
    (id) => engine.getState().G.cardIndex[id]!.definitionId,
  );
}

function expectZoneToContain(
  engine: CyberpunkTestEngine,
  playerId: PlayerId,
  zone: CardZone,
  card: StructuredCardDefinition,
  expected: boolean,
): void {
  expect(engine.getCardsInZone(zone, playerId).some((c) => c.definitionId === card.id)).toBe(
    expected,
  );
}

describe("Floor It", () => {
  describe("UI prompt", () => {
    it("shows the program as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [program],
        eddies: program.cost,
      });
      expectCardPlayable(engine, program);
    });

    it("presents the correct targets after playing", () => {
      const engine = floorItFixture({ field: [{ card: lowlife, spent: true }] });
      engine.playCard(program);
      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
      expectEligibleTargets(engine, [lowlife]);
    });
  });

  describe(`Return a spent unit with cost 4 or less to its owner's hand.`, () => {
    it("returns a spent friendly unit to the owner's hand", () => {
      const engine = floorItFixture({ field: [{ card: lowlife, spent: true }] });

      const handBefore = engine.getHandCount(P1);

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      // -1 program played, +1 unit returned = net 0 change
      expect(engine.getHandCount(P1)).toBe(handBefore);
      expectZoneToContain(engine, P1, "field", lowlife, false);
    });

    it("clears spent and other field metadata when the returned unit is replayed", () => {
      const engine = floorItFixture({
        eddies: program.cost + lowlife.cost,
        field: [{ card: lowlife, spent: true }],
      });
      engine.judgeSetCardMeta(lowlife, {
        damage: 2,
        counters: { boosted: 1 },
        powerModifier: 3,
        hasAttackedThisTurn: true,
      });

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      const returnedUnit = engine.getCard(lowlife, "hand", P1);
      expect(returnedUnit.meta.spent).toBe(false);
      expect(returnedUnit.meta.damage).toBe(0);
      expect(returnedUnit.meta.counters).toEqual({});
      expect(returnedUnit.meta.powerModifier).toBe(0);
      expect(returnedUnit.meta.hasAttackedThisTurn).toBe(false);

      engine.playCard(lowlife);

      const replayedUnit = engine.getCard(lowlife, "field", P1);
      expect(replayedUnit.meta.spent).toBe(false);
      expect(replayedUnit.meta.damage).toBe(0);
      expect(replayedUnit.meta.counters).toEqual({});
      expect(replayedUnit.meta.powerModifier).toBe(0);
      expect(replayedUnit.meta.playedThisTurn).toBe(true);
    });

    it("returns a spent rival unit to the rival's hand (owner's hand)", () => {
      const engine = floorItFixture({}, { field: [{ card: lowlife, spent: true }] });

      const p2HandBefore = engine.getHandCount(P2);

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      // Lowlife returns to P2's hand (its owner), not P1's
      expect(engine.getHandCount(P2)).toBe(p2HandBefore + 1);
      expectZoneToContain(engine, P2, "field", lowlife, false);
    });

    it("offers spent rival units with cost 4 or less from the target DSL", () => {
      const engine = floorItFixture(
        { field: [{ card: lowlife, spent: true }] },
        {
          field: [
            { card: huscle, spent: true },
            { card: jackie, spent: true },
            { card: corpo, spent: false },
          ],
        },
      );

      engine.playCard(program);

      expect(eligibleDefinitions(engine).sort((a, b) => a.localeCompare(b))).toEqual(
        [huscle.id, lowlife.id].sort((a, b) => a.localeCompare(b)),
      );
    });

    it("program goes to trash after resolving", () => {
      const engine = floorItFixture({}, { field: [{ card: lowlife, spent: true }] });

      engine.playCard(program);
      engine.resolveEffectTarget(lowlife);

      expectZoneToContain(engine, P1, "trash", program, true);
    });

    it("deducts 3 eddies from the player", () => {
      const engine = floorItFixture({ eddies: 5 }, { field: [{ card: lowlife, spent: true }] });

      engine.playCard(program);

      expect(engine.getEddies(P1)).toBe(2); // 5 - 3
    });

    it("can target a unit with cost exactly 3 (within limit)", () => {
      const engine = floorItFixture({}, { field: [{ card: huscle, spent: true }] });

      engine.playCard(program);
      engine.resolveEffectTarget(huscle);

      expectZoneToContain(engine, P2, "field", huscle, false);
    });

    it("cannot target a unit with cost > 4", () => {
      const engine = floorItFixture({}, { field: [{ card: jackie, spent: true }] }); // cost 6

      engine.playCard(program);

      // Jackie stays on field — cost too high
      expectZoneToContain(engine, P2, "field", jackie, true);
    });

    it("cannot target a ready (unspent) unit", () => {
      const engine = floorItFixture({}, { field: [{ card: lowlife, spent: false }] });

      engine.playCard(program);

      // Ready unit is not a valid target
      expectZoneToContain(engine, P2, "field", lowlife, true);
    });

    it("fails when player has insufficient eddies", () => {
      const engine = floorItFixture({ eddies: 2 }, { field: [{ card: lowlife, spent: true }] });
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.playCard(program));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("emits an action log for playing the program", () => {
      const engine = floorItFixture({}, { field: [{ card: lowlife, spent: true }] });

      engine.playCard(program);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.playCard");
      expect(log!.params.cardName).toBe(program.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(program.displayName);
    });
  });
});
