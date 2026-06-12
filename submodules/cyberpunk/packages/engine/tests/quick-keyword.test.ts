import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockProgram,
  createMockUnit,
  registerMatchers,
} from "../src/testing/index.ts";
import "../src/testing/matchers.d.ts";

beforeAll(() => {
  registerMatchers();
});

/**
 * QUICK keyword — playable as a reaction when a rival Unit attacks.
 *
 * Rules:
 *   - QUICK: Keyword that lets you also play this Program as a reaction
 *     when a rival Unit attacks.
 */
describe("QUICK keyword", () => {
  it("allows a QUICK Program to be played during the defensive step", () => {
    const quickProgram = createMockProgram({
      id: "quick-program",
      name: "Quick Program",
      cost: 1,
      keywords: ["quick"],
    });
    const attacker = createMockUnit({ id: "attacker", name: "Attacker", cost: 1, power: 3 });

    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [quickProgram], eddies: 5 },
      { field: [attacker], eddies: 5 },
    );

    // P2 attacks P1's field directly (no defender).
    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack(); // offensive → defensive

    // Now it's P1's defensive step. P1 can play the QUICK Program.
    expect(engine.getPrompt(P1).availableMoves.some((m) => m.moveId === "playCard")).toBe(true);
    expect(engine.playCard(quickProgram, { as: P1 })).toBeSuccessfulCommand();
  });

  it("prevents a non-QUICK card from being played during the defensive step", () => {
    const normalProgram = createMockProgram({
      id: "normal-program",
      name: "Normal Program",
      cost: 1,
    });
    const attacker = createMockUnit({ id: "attacker2", name: "Attacker 2", cost: 1, power: 3 });

    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [normalProgram], eddies: 5 },
      { field: [attacker], eddies: 5 },
    );

    engine.attackRival(attacker, { as: P2 });
    engine.resolveAttack(); // offensive → defensive

    // P1 cannot play a non-QUICK card during the defensive step.
    expect(engine.getPrompt(P1).availableMoves.some((m) => m.moveId === "playCard")).toBe(false);

    const failure = engine.expectFailure(() => engine.playCard(normalProgram, { as: P1 }));
    expect(failure.errorCode).toBe("NOT_QUICK");
  });

  it("still allows a QUICK Program to be played on your own turn", () => {
    const quickProgram = createMockProgram({
      id: "quick-program2",
      name: "Quick Program 2",
      cost: 1,
      keywords: ["quick"],
    });

    const engine = CyberpunkTestEngine.createWithFixture({ hand: [quickProgram], eddies: 5 }, {});

    expect(engine.playCard(quickProgram, { as: P1 })).toBeSuccessfulCommand();
  });

  it("allows both QUICK and non-QUICK cards to be played normally when there is no attack in progress", () => {
    const quickProgram = createMockProgram({
      id: "quick-program3",
      name: "Quick Program 3",
      cost: 1,
      keywords: ["quick"],
    });
    const normalProgram = createMockProgram({
      id: "normal-program2",
      name: "Normal Program 2",
      cost: 1,
    });

    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [quickProgram, normalProgram], eddies: 5 },
      {},
    );

    // On P1's turn, both cards are playable.
    const prompt = engine.getPrompt(P1);
    const playCardMove = prompt.availableMoves.find((m) => m.moveId === "playCard");
    expect(playCardMove).toBeDefined();

    const candidates = (
      playCardMove!.inputSpec as { type: "playCard"; candidates: { cardId: string }[] }
    ).candidates;
    expect(
      candidates.some((c) => c.cardId === engine.getCard(quickProgram, "hand", P1).instanceId),
    ).toBe(true);
    expect(
      candidates.some((c) => c.cardId === engine.getCard(normalProgram, "hand", P1).instanceId),
    ).toBe(true);
  });
});
