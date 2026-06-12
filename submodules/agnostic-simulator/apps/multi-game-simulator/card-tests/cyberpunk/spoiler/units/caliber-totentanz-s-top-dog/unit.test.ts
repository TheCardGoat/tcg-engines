import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
  expectPendingChoice,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  spoilerCaliberTotentanzSTopDog,
  alphaArmoredMinotaur,
  alphaMt0d12Flathead,
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
} from "@tcg/cyberpunk-cards";
import { createMockUnit } from "@cyberpunk-engine/testing/index.ts";

const caliber = spoilerCaliberTotentanzSTopDog; // unit, cost 5, power 6 — DEFEATED: rival discards 1 (+1 if cost matches a friendly Gig)
const minotaur = alphaArmoredMinotaur; // unit, power 9 — defeats caliber in a fight
const flathead = alphaMt0d12Flathead; // unit, cost 5 — matches the friendly d6 showing 5
const corpoSecurity = alphaCorpoSecurity; // unit, cost 2 — does not match the friendly d6 showing 5
const lowlife = alphaRuthlessLowlife;

describe("Caliber - Totentanz's Top Dog", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: caliber, spent: false }],
      });
      expectAttackCandidate(engine, caliber);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: caliber, spent: true }],
      });
      expectNotAttackCandidate(engine, caliber);
    });

    it("presents a discardFromHand choice for the rival when defeated", () => {
      const filler = createMockUnit({ name: "Filler" });
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: caliber, spent: false }],
        },
        {
          field: [{ card: minotaur, spent: true }],
          hand: [filler, filler, filler, filler, filler],
          deck: 30,
        },
      );
      engine.attackUnit(caliber, minotaur);
      engine.resolveFullFight();

      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "discardFromHand", amount: 1 });
    });
  });

  it("definition matches expected stats", () => {
    expect(caliber.type).toBe("unit");
    expect(caliber.cost).toBe(5);
    expect(caliber.power).toBe(6);
    expect(caliber.abilities).toHaveLength(1);
    expect(caliber.abilities[0]?.kind).toBe("triggered");
    expect(caliber.abilities[0]?.trigger?.trigger).toBe("defeated");
  });

  it("on defeat, fires a discardFromHand chooseTarget for the rival", () => {
    // Caliber (P1, power 6) attacks Minotaur (P2, power 9, spent so legal target).
    // Caliber loses → trashed → DEFEATED trigger fires → rival (P2) must
    // pick a card to discard from their hand of 5+.
    const filler = createMockUnit({ name: "Filler" });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: caliber, spent: false }],
      },
      {
        field: [{ card: minotaur, spent: true }],
        hand: [filler, filler, filler, filler, filler],
        deck: 30,
      },
    );

    engine.attackUnit(caliber, minotaur);
    engine.resolveFullFight();

    // Caliber should be in P1's trash (defeated by Minotaur).
    expect(engine.getCardsInZone("trash", P1).some((c) => c.definitionId === caliber.id)).toBe(
      true,
    );

    // P2 (rival of Caliber's controller) should have a pending discard choice.
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toBeDefined();
    expect(choice!.type).toBe("chooseTarget");
    expect(
      (choice as { payload: { type: string; player: string; amount: number } }).payload.type,
    ).toBe("discardFromHand");
    expect(
      (choice as { payload: { type: string; player: string; amount: number } }).payload.player,
    ).toBe("rival");
  });

  it("requires one additional discard when the discarded card's cost matches a friendly gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: caliber, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      {
        field: [{ card: minotaur, spent: true }],
        hand: [flathead, corpoSecurity, lowlife],
        deck: 30,
      },
    );

    engine.attackUnit(caliber, minotaur);
    engine.resolveFullFight();

    engine.resolveDiscardFromHand([flathead], { as: P2 });

    const bonusChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(bonusChoice?.type).toBe("chooseTarget");
    if (!bonusChoice || bonusChoice.type !== "chooseTarget") {
      throw new Error("Expected chooseTarget");
    }
    expect(bonusChoice?.payload.type).toBe("discardFromHand");

    engine.resolveDiscardFromHand([corpoSecurity], { as: P2 });

    expect(engine.getHandCount(P2)).toBe(1);
  });

  it("does not require the additional discard when the discarded card's cost does not match", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: caliber, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      {
        field: [{ card: minotaur, spent: true }],
        hand: [corpoSecurity, flathead],
        deck: 30,
      },
    );

    engine.attackUnit(caliber, minotaur);
    engine.resolveFullFight();

    engine.resolveDiscardFromHand([corpoSecurity], { as: P2 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getHandCount(P2)).toBe(1);
  });
});
