import { describe, expect, it } from "vite-plus/test";

import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockResource,
  createMockUnit,
} from "../gundam/testing/index.ts";
import type { PlayerId } from "../types/branded.ts";

import { enumerateGundamBotCandidates } from "./candidate-enumerator.ts";
import { strategicStrategy } from "./strategic-strategy.ts";

function rankedCandidates(engine: GundamTestEngine) {
  const state = engine.runtime.getState();
  return strategicStrategy.selectCandidates({
    playerId: PLAYER_ONE as PlayerId,
    state,
    view: engine.runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE as PlayerId }),
    candidates: enumerateGundamBotCandidates(
      state,
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    ),
    turnNumber: 0,
    pendingChoice: null,
    cards: engine.runtime.getCardReadAPI(),
  });
}

describe("strategicStrategy", () => {
  it("develops the board before committing an available attacker", () => {
    const attacker = createMockUnit({ name: "Attacker", cost: 1, level: 1, ap: 2, hp: 2 });
    const deploy = createMockUnit({ name: "Deploy", cost: 1, level: 1, ap: 3, hp: 3 });
    const engine = GundamTestEngine.create({
      play: [attacker],
      hand: [deploy],
      resourceArea: [createMockResource(), createMockResource()],
    });

    const ranked = rankedCandidates(engine);
    expect(ranked.some((candidate) => candidate.family === "enterBattle")).toBe(true);
    expect(ranked[0]?.family).toBe("deployUnit");
  });

  it("prioritizes direct pressure in the two-shield closing window", () => {
    const attacker = createMockUnit({ name: "Attacker", cost: 1, level: 1, ap: 2, hp: 2 });
    const valuableTarget = createMockUnit({ name: "Target", cost: 4, level: 4, ap: 4, hp: 2 });
    const shieldA = createMockUnit({ name: "Shield A" });
    const shieldB = createMockUnit({ name: "Shield B" });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      {
        play: [{ card: valuableTarget, exhausted: true }],
        shieldArea: [shieldA, shieldB],
      },
    );

    const firstAttack = rankedCandidates(engine).find(
      (candidate) => candidate.family === "enterBattle",
    );
    expect(firstAttack).toMatchObject({ family: "enterBattle", target: "direct" });
  });
});
