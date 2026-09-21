import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../testing/matchers.d.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockGear,
  createMockLegend,
  createMockUnit,
  registerMatchers,
} from "../testing/index.ts";

beforeAll(() => {
  registerMatchers();
});

describe("callLegend", () => {
  describe("Comprehensive Rules 11.11.1 cost", () => {
    it("pays exactly 1 €$ from the eddie pool", () => {
      const legend = createMockLegend({ name: "Called Legend" });
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: legend, faceDown: true }],
        eddies: 1,
      });
      engine.spendAllLegends();

      expect(engine.callLegend(legend, { as: P1 })).toBeSuccessfulCommand();

      expect(engine.getCard(legend, "legendArea", P1).meta.faceDown).toBe(false);
      expect(engine.getEddies(P1)).toBe(0);
      expect(engine.getEvents("eddiesSpent")).toEqual([
        expect.objectContaining({ amount: 1, forWhat: "callLegend", playerId: P1 }),
      ]);
    });

    it("does not charge the retired beta cost of 2 €$", () => {
      const legend = createMockLegend({ name: "Called Legend" });
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: legend, faceDown: true }],
        eddies: 2,
      });
      engine.spendAllLegends();

      expect(engine.callLegend(legend, { as: P1 })).toBeSuccessfulCommand();
      expect(engine.getEddies(P1)).toBe(1);
    });

    it("fails when the player has no Eddies and no ready Legends", () => {
      const legend = createMockLegend({ name: "Called Legend" });
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: legend, faceDown: true }],
        eddies: 0,
      });
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.callLegend(legend, { as: P1 }));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
      expect(engine.getCard(legend, "legendArea", P1).meta.faceDown).toBe(true);
    });

    it("can pay the 1 €$ cost by spending a ready Legend", () => {
      const toCall = createMockLegend({ name: "Legend To Call" });
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: toCall, faceDown: true }],
        eddies: 0,
      });

      const result = engine.callLegend(toCall, { as: P1 });
      expect(result).toBeSuccessfulCommand();

      const called = engine.getCard(toCall, "legendArea", P1);
      expect(called.meta.faceDown).toBe(false);
      expect(called.meta.spent).toBe(true);
      expect(engine.getEddies(P1)).toBe(0);
      expect(
        result.animationScript.steps.filter(
          (step) => step.kind === "legendReveal" || step.kind === "entityStateChange",
        ),
      ).toMatchObject([
        {
          kind: "legendReveal",
          fromRotationDeg: 0,
          toRotationDeg: 90,
        },
      ]);
    });

    it("does not treat Gear attached beneath a Legend as an Eddie source", () => {
      const toCall = createMockLegend({ name: "Equipped Legend" });
      const gear = createMockGear({ name: "Attached Gear" });
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [
          {
            card: toCall,
            faceDown: true,
            attachedGears: [gear],
          },
        ],
        eddies: 0,
      });

      expect(engine.callLegend(toCall, { as: P1 })).toBeSuccessfulCommand();

      const called = engine.getCard(toCall, "legendArea", P1);
      const attached = engine
        .getCardsInZone("legendArea", P1)
        .find((card) => card.meta.attachedToId === called.instanceId);
      expect(called.meta.spent).toBe(true);
      expect(attached?.meta.spent).toBe(false);
    });

    it("keeps an already-spent Legend spent while it flips face-up", () => {
      const legend = createMockLegend({ name: "Spent Called Legend" });
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: legend, faceDown: true }],
        eddies: 1,
      });
      engine.spendAllLegends();

      const result = engine.callLegend(legend, { as: P1 });
      expect(result).toBeSuccessfulCommand();

      expect(result.animationScript.steps).toContainEqual(
        expect.objectContaining({
          kind: "legendReveal",
          fromRotationDeg: 90,
          toRotationDeg: 90,
        }),
      );
      expect(engine.getCard(legend, "legendArea", P1).meta.spent).toBe(true);
    });

    it("pays 1 €$ when Calling as a reaction", () => {
      const attacker = createMockUnit({ name: "Attacker", power: 1 });
      const legend = createMockLegend({ name: "Reaction Legend" });
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [attacker] },
        {
          legendArea: [{ card: legend, faceDown: true }],
          eddies: 1,
        },
        { activePlayerId: P1 },
      );
      engine.spendAllLegends(P2);

      engine.attackRival(attacker, { as: P1 });
      engine.resolveAttack({ as: P1 });

      expect(engine.callLegend(legend, { as: P2 })).toBeSuccessfulCommand();
      expect(engine.getEddies(P2)).toBe(0);
      expect(engine.getCard(legend, "legendArea", P2).meta.faceDown).toBe(false);
    });
  });
});
