import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  registerMatchers,
  expectCallableLegend,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { spoilerRoycePsychoOnTheEdge, spoilerGorillaArms } from "@tcg/cyberpunk-cards";

registerMatchers();

describe("Royce - Psycho on the Edge", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, spoilerRoycePsychoOnTheEdge);
    });

    it("shows the legend as an attack candidate after entering the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: spoilerRoycePsychoOnTheEdge, spent: false }],
      });
      expectAttackCandidate(engine, spoilerRoycePsychoOnTheEdge);
    });

    it("does NOT show a spent legend as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: spoilerRoycePsychoOnTheEdge, spent: true }],
      });
      expectNotAttackCandidate(engine, spoilerRoycePsychoOnTheEdge);
    });
  });

  describe(`GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)`, () => {
    it("enters the field ready (not spent)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: spoilerRoycePsychoOnTheEdge, spent: false }],
      });
      expect(engine.getCard(spoilerRoycePsychoOnTheEdge).meta.spent).toBe(false);
      expect(engine.getCard(spoilerRoycePsychoOnTheEdge).zone).toBe("field");
    });

    it("can attack the rival on the same turn it enters", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: spoilerRoycePsychoOnTheEdge, spent: false }],
      });
      engine.attackRival(spoilerRoycePsychoOnTheEdge);
      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
    });

    it("is spent after attacking", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: spoilerRoycePsychoOnTheEdge, spent: false }],
      });
      engine.attackRival(spoilerRoycePsychoOnTheEdge);
      expect(engine.getCard(spoilerRoycePsychoOnTheEdge).meta.spent).toBe(true);
    });

    it("cannot attack when spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: spoilerRoycePsychoOnTheEdge, spent: true }],
      });
      const failure = engine.expectFailure(() => engine.attackRival(spoilerRoycePsychoOnTheEdge));
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("keeps equipped gear and scaled power after going solo", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: false }],
        hand: [spoilerGorillaArms],
        eddies: spoilerRoycePsychoOnTheEdge.cost! + spoilerGorillaArms.cost!,
      });
      engine.attachGear(spoilerGorillaArms, spoilerRoycePsychoOnTheEdge);
      const royceId = engine.getCard(spoilerRoycePsychoOnTheEdge, "legendArea", P1)
        .instanceId as string;

      const result = engine.getLocalEngine().processCommand(
        {
          commandID: "royce-go-solo-with-gear",
          move: "goSolo",
          input: { args: { cardId: royceId } },
        },
        P1,
      );

      expect(result).toBeSuccessfulCommand();
      const royce = engine.getCard(spoilerRoycePsychoOnTheEdge, "field", P1);
      expect(royce.meta.attachedGearIds).toHaveLength(1);
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 12,
      });
    });
  });

  describe(`During your turn, this Legend has +2 power for each equipped Gear.`, () => {
    it("has base power 6 with no gear, face-up during owner's turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: false }],
      });
      const royce = engine.getCard(spoilerRoycePsychoOnTheEdge, "legendArea", P1);
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 6,
      });
    });

    it("has power 12 with 1 Gorilla Arms attached during owner's turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: false }],
        hand: [spoilerGorillaArms],
        eddies: spoilerGorillaArms.cost ?? 4,
      });
      engine.attachGear(spoilerGorillaArms, spoilerRoycePsychoOnTheEdge);
      const royce = engine.getCard(spoilerRoycePsychoOnTheEdge, "legendArea", P1);
      // base 6 + gear power 4 + static 1×2 = 12
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 12,
      });
    });

    it("has power 10 with 1 Gorilla Arms attached during opponent's turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: false }],
          hand: [spoilerGorillaArms],
          eddies: spoilerGorillaArms.cost ?? 4,
        },
        { deck: 40 },
      );
      engine.attachGear(spoilerGorillaArms, spoilerRoycePsychoOnTheEdge);
      engine.completeTurn();
      // now P2's turn — static condition "friendly turn" fails
      const royce = engine.getCard(spoilerRoycePsychoOnTheEdge, "legendArea", P1);
      // base 6 + gear power 4 + static 0 = 10
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 10,
      });
    });

    it("has power 18 with 2 Gorilla Arms attached during owner's turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: false }],
        hand: [spoilerGorillaArms, spoilerGorillaArms],
        eddies: (spoilerGorillaArms.cost ?? 4) * 2,
      });
      engine.attachGear(spoilerGorillaArms, spoilerRoycePsychoOnTheEdge);
      engine.attachGear(spoilerGorillaArms, spoilerRoycePsychoOnTheEdge);
      const royce = engine.getCard(spoilerRoycePsychoOnTheEdge, "legendArea", P1);
      // base 6 + gear power 4+4 + static 2×2 = 18
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 18,
      });
    });

    it("has power 10 when face-down with gear attached (static inactive)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: false }],
        hand: [spoilerGorillaArms],
        eddies: spoilerGorillaArms.cost ?? 4,
      });
      engine.attachGear(spoilerGorillaArms, spoilerRoycePsychoOnTheEdge);
      const royce = engine.getCard(spoilerRoycePsychoOnTheEdge, "legendArea", P1);
      engine.judgeSetCardMeta(royce, { faceDown: true }, { as: P1 });
      // Static inactive when face-down; gear power still counted
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 10,
      });
    });

    it("power updates dynamically: 6 before attach, 12 after attach", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: false }],
        hand: [spoilerGorillaArms],
        eddies: spoilerGorillaArms.cost ?? 4,
      });
      const royceId = engine.getCard(spoilerRoycePsychoOnTheEdge, "legendArea", P1)
        .instanceId as string;
      expect(engine.getState()).toHaveEffectivePower({ card: royceId, value: 6 });
      engine.attachGear(spoilerGorillaArms, spoilerRoycePsychoOnTheEdge);
      expect(engine.getState()).toHaveEffectivePower({ card: royceId, value: 12 });
    });

    it("gear on P2's field does not buff Royce", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: false }] },
        { field: [{ card: spoilerGorillaArms, spent: false }], deck: 40 },
      );
      const royce = engine.getCard(spoilerRoycePsychoOnTheEdge, "legendArea", P1);
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 6,
      });
    });

    it("power returns to 10 on P2's turn and 12 on P1's next turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: false }],
          hand: [spoilerGorillaArms],
          eddies: spoilerGorillaArms.cost ?? 4,
        },
        { deck: 40 },
      );
      engine.attachGear(spoilerGorillaArms, spoilerRoycePsychoOnTheEdge);
      const royceId = engine.getCard(spoilerRoycePsychoOnTheEdge, "legendArea", P1)
        .instanceId as string;

      expect(engine.getState()).toHaveEffectivePower({ card: royceId, value: 12 });
      engine.completeTurn();
      expect(engine.getState()).toHaveEffectivePower({ card: royceId, value: 10 });
      engine.completeTurn({ as: P2 });
      expect(engine.getState()).toHaveEffectivePower({ card: royceId, value: 12 });
    });
  });
});
