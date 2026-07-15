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
import {
  welcomeToNightCityRetailRoycePsychoOnTheEdge,
  welcomeToNightCityRetailGorillaArms,
} from "@tcg/cyberpunk-cards";

registerMatchers();

describe("Royce - Psycho on the Edge", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, welcomeToNightCityRetailRoycePsychoOnTheEdge);
    });

    it("shows the legend as an attack candidate after entering the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, spent: false }],
      });
      expectAttackCandidate(engine, welcomeToNightCityRetailRoycePsychoOnTheEdge);
    });

    it("does NOT show a spent legend as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, spent: true }],
      });
      expectNotAttackCandidate(engine, welcomeToNightCityRetailRoycePsychoOnTheEdge);
    });
  });

  describe(`GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)`, () => {
    it("enters the field ready (not spent)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, spent: false }],
      });
      expect(engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge).meta.spent).toBe(false);
      expect(engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge).zone).toBe("field");
    });

    it("can attack the rival on the same turn it enters", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, spent: false }],
      });
      engine.attackRival(welcomeToNightCityRetailRoycePsychoOnTheEdge);
      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
    });

    it("is spent after attacking", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, spent: false }],
      });
      engine.attackRival(welcomeToNightCityRetailRoycePsychoOnTheEdge);
      expect(engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge).meta.spent).toBe(true);
    });

    it("cannot attack when spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, spent: true }],
      });
      const failure = engine.expectFailure(() =>
        engine.attackRival(welcomeToNightCityRetailRoycePsychoOnTheEdge),
      );
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("keeps equipped gear and scaled power after going solo", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
        hand: [welcomeToNightCityRetailGorillaArms],
        eddies:
          welcomeToNightCityRetailRoycePsychoOnTheEdge.cost! +
          welcomeToNightCityRetailGorillaArms.cost!,
      });
      engine.attachGear(
        welcomeToNightCityRetailGorillaArms,
        welcomeToNightCityRetailRoycePsychoOnTheEdge,
      );
      const royceId = engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "legendArea", P1)
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
      const royce = engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "field", P1);
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
        legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
      });
      const royce = engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "legendArea", P1);
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 6,
      });
    });

    it("has power 12 with 1 Gorilla Arms attached during owner's turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
        hand: [welcomeToNightCityRetailGorillaArms],
        eddies: welcomeToNightCityRetailGorillaArms.cost ?? 4,
      });
      engine.attachGear(
        welcomeToNightCityRetailGorillaArms,
        welcomeToNightCityRetailRoycePsychoOnTheEdge,
      );
      const royce = engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "legendArea", P1);
      // base 6 + gear power 4 + static 1×2 = 12
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 12,
      });
    });

    it("has power 10 with 1 Gorilla Arms attached during opponent's turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
          hand: [welcomeToNightCityRetailGorillaArms],
          eddies: welcomeToNightCityRetailGorillaArms.cost ?? 4,
        },
        { deck: 40 },
      );
      engine.attachGear(
        welcomeToNightCityRetailGorillaArms,
        welcomeToNightCityRetailRoycePsychoOnTheEdge,
      );
      engine.completeTurn();
      // now P2's turn — static condition "friendly turn" fails
      const royce = engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "legendArea", P1);
      // base 6 + gear power 4 + static 0 = 10
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 10,
      });
    });

    it("has power 18 with 2 Gorilla Arms attached during owner's turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
        hand: [welcomeToNightCityRetailGorillaArms, welcomeToNightCityRetailGorillaArms],
        eddies: (welcomeToNightCityRetailGorillaArms.cost ?? 4) * 2,
      });
      engine.attachGear(
        welcomeToNightCityRetailGorillaArms,
        welcomeToNightCityRetailRoycePsychoOnTheEdge,
      );
      engine.attachGear(
        welcomeToNightCityRetailGorillaArms,
        welcomeToNightCityRetailRoycePsychoOnTheEdge,
      );
      const royce = engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "legendArea", P1);
      // base 6 + gear power 4+4 + static 2×2 = 18
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 18,
      });
    });

    it("has power 10 when face-down with gear attached (static inactive)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
        hand: [welcomeToNightCityRetailGorillaArms],
        eddies: welcomeToNightCityRetailGorillaArms.cost ?? 4,
      });
      engine.attachGear(
        welcomeToNightCityRetailGorillaArms,
        welcomeToNightCityRetailRoycePsychoOnTheEdge,
      );
      const royce = engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "legendArea", P1);
      engine.judgeSetCardMeta(royce, { faceDown: true }, { as: P1 });
      // Static inactive when face-down; gear power still counted
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 10,
      });
    });

    it("power updates dynamically: 6 before attach, 12 after attach", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
        hand: [welcomeToNightCityRetailGorillaArms],
        eddies: welcomeToNightCityRetailGorillaArms.cost ?? 4,
      });
      const royceId = engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "legendArea", P1)
        .instanceId as string;
      expect(engine.getState()).toHaveEffectivePower({ card: royceId, value: 6 });
      engine.attachGear(
        welcomeToNightCityRetailGorillaArms,
        welcomeToNightCityRetailRoycePsychoOnTheEdge,
      );
      expect(engine.getState()).toHaveEffectivePower({ card: royceId, value: 12 });
    });

    it("gear on P2's field does not buff Royce", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }] },
        { field: [{ card: welcomeToNightCityRetailGorillaArms, spent: false }], deck: 40 },
      );
      const royce = engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "legendArea", P1);
      expect(engine.getState()).toHaveEffectivePower({
        card: royce.instanceId as string,
        value: 6,
      });
    });

    it("power returns to 10 on P2's turn and 12 on P1's next turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [{ card: welcomeToNightCityRetailRoycePsychoOnTheEdge, faceDown: false }],
          hand: [welcomeToNightCityRetailGorillaArms],
          eddies: welcomeToNightCityRetailGorillaArms.cost ?? 4,
        },
        { deck: 40 },
      );
      engine.attachGear(
        welcomeToNightCityRetailGorillaArms,
        welcomeToNightCityRetailRoycePsychoOnTheEdge,
      );
      const royceId = engine.getCard(welcomeToNightCityRetailRoycePsychoOnTheEdge, "legendArea", P1)
        .instanceId as string;

      expect(engine.getState()).toHaveEffectivePower({ card: royceId, value: 12 });
      engine.completeTurn();
      expect(engine.getState()).toHaveEffectivePower({ card: royceId, value: 10 });
      engine.completeTurn({ as: P2 });
      expect(engine.getState()).toHaveEffectivePower({ card: royceId, value: 12 });
    });
  });
});
