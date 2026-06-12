import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mulanEliteArcher } from "@tcg/lorcana-cards/cards/004";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

// TRIPLE SHOT: "During your turn, whenever this character deals damage to another
// character in a challenge, deal the same amount of damage to up to 2 other chosen
// characters." Defined at lorcana-cards/src/cards/004/characters/114-mulan-elite-archer.ts
// with `count: { upTo: 2 }` and `excludeTriggerSubject: true`.
//
// UI-level behaviour under test:
//  - The prompt family is `deal-damage`.
//  - The challenge defender (the trigger subject) must NOT appear as a candidate.
//  - Up to 2 selections are allowed, but any number from 0..2 is legal.
//  - Candidate pool spans both players (owner: "any").

const defender = createMockCharacter({
  id: "mea-defender",
  name: "Stonewall",
  cost: 4,
  strength: 2,
  willpower: 10,
  lore: 1,
});

const bystander1 = createMockCharacter({
  id: "mea-bystander1",
  name: "Bystander One",
  cost: 3,
  strength: 2,
  willpower: 10,
  lore: 1,
});

const bystander2 = createMockCharacter({
  id: "mea-bystander2",
  name: "Bystander Two",
  cost: 5,
  strength: 4,
  willpower: 10,
  lore: 1,
});

function createTripleShotEngine() {
  const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [{ card: mulanEliteArcher, isDrying: false }],
      deck: 1,
    },
    {
      play: [{ card: defender, exerted: true }, { card: bystander1 }, { card: bystander2 }],
      deck: 1,
    },
  );

  expect(testEngine.asPlayerOne().challenge(mulanEliteArcher, defender)).toBeSuccessfulCommand();
  return testEngine;
}

describe("Mulan - Elite Archer | TRIPLE SHOT | UI prompt", () => {
  it("surfaces a deal-damage target prompt after a successful challenge", () => {
    const testEngine = createTripleShotEngine();
    const snapshot = snapshotPendingPrompt(testEngine);

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.effectType).toBe("deal-damage");
    // Triple Shot allows up to 2 splash targets — 2 slots are generated (one per
    // maxSelections) so the user can fill them sequentially and stop early.
    expect(snapshot?.prompt?.slots.map((slot) => slot.label)).toEqual([
      "Deal damage to",
      "Deal damage to",
    ]);
    expect(snapshot?.message).toBe("Choose the character to deal damage to.");
  });

  it("allows selecting between 0 and 2 targets (count.upTo: 2)", () => {
    const testEngine = createTripleShotEngine();
    const snapshot = snapshotPendingPrompt(testEngine);

    expect(snapshot?.maxSelections).toBe(2);
    // upTo means the minimum is 0 — the player may resolve with no splash targets.
    expect(snapshot?.minSelections).toBeLessThanOrEqual(0);
  });

  it("excludes the challenge defender (excludeTriggerSubject: true)", () => {
    const testEngine = createTripleShotEngine();
    const defenderId = testEngine.asPlayerOne().getCard(defender).id;
    const bystander1Id = testEngine.asPlayerOne().getCard(bystander1).id;
    const bystander2Id = testEngine.asPlayerOne().getCard(bystander2).id;

    const snapshot = snapshotPendingPrompt(testEngine);
    const candidateIds = snapshot?.prompt?.candidateEntries.map((entry) => entry.cardId) ?? [];

    expect(candidateIds).toContain(bystander1Id);
    expect(candidateIds).toContain(bystander2Id);
    // Regression guard: the defender that just took challenge damage is the trigger
    // subject and must not appear as a splash target.
    expect(candidateIds).not.toContain(defenderId);
  });

  it("excludes Mulan herself — the card text says 'other chosen characters'", () => {
    const testEngine = createTripleShotEngine();
    const mulanId = testEngine.asPlayerOne().getCard(mulanEliteArcher).id;
    const bystander1Id = testEngine.asPlayerOne().getCard(bystander1).id;
    const bystander2Id = testEngine.asPlayerOne().getCard(bystander2).id;

    const snapshot = snapshotPendingPrompt(testEngine);
    const candidateIds = snapshot?.prompt?.candidateEntries.map((entry) => entry.cardId) ?? [];

    // Only the two bystanders should remain: "deal the same amount of damage to
    // up to 2 OTHER chosen characters" — excluding the source itself.
    expect(candidateIds).not.toContain(mulanId);
    expect(candidateIds.sort()).toEqual([bystander1Id, bystander2Id].sort());
  });
});
