import { describe, expect, test } from "vite-plus/test";
import {
  buildDecisionContext,
  CyberpunkTestEngine,
  P1,
  tacticalStrategy,
} from "@tcg/cyberpunk-engine";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
} from "@tcg/cyberpunk-cards";
import { bindStrategyToDeck } from "../src/bind-deck-strategy.ts";
import { playCoachMatch } from "../src/coach-play.ts";
import { deckProfileFor } from "../src/deck-profiles.ts";

describe("Judy authored profile bind", () => {
  test("authored Judy profile prefers spending Nothing to Doubt over attacking or developing", () => {
    expect(deckProfileFor("authored-judy-top-deck-discount")?.preferSpendOverAttack).toEqual([
      "Judy Álvarez",
    ]);
    const bound = bindStrategyToDeck(tacticalStrategy, {
      id: "authored-judy-top-deck-discount",
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
            spent: false,
            hasLag: false,
          },
        ],
        eddies: 6,
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailCorpoSecurity,
        ],
      },
      { gigArea: [{ dieType: "d6", faceValue: 2 }] },
    );
    const ctx = buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
    const decision = bound.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("activateAbility");
  });

  test("live authored Judy dump activates Nothing to Doubt Spend", () => {
    const dump = playCoachMatch({
      strategyA: "tactical",
      strategyB: "tactical",
      seed: "judy-spend-live",
      deckSource: "authored-botlab",
      deckAId: "authored-judy-top-deck-discount",
      maxSteps: 1500,
    });
    const ntdSpend = dump.steps.some(
      (step) =>
        step.move === "activateAbility" &&
        step.moveLogs.some((log) => {
          const name = (log as { params?: { cardName?: string } }).params?.cardName;
          return typeof name === "string" && name.includes("Nothing to Doubt");
        }),
    );
    expect(ntdSpend).toBe(true);
  });
});
