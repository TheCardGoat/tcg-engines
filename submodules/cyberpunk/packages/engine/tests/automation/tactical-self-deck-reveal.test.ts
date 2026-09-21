/**
 * Self-deck reveal activations (Judy Álvarez: Nothing to Doubt) must be scored
 * from their deterministic fork — the simulator observes the revealed top card
 * exactly as the activating player would, so the hidden-information cutoff
 * must not blind the search to the activation's real outcome. See
 * SELF_DECK_REVEAL_EFFECT_HINTS in search/tactical.ts.
 */
import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
  welcomeToNightCityRetailMaxtacSuppressionTeam,
  welcomeToNightCityRetailPlacideVoodooSentinel,
} from "@tcg/cyberpunk-cards";
import { buildDecisionContext, tacticalStrategy } from "../../src/automation/index.ts";
import { CyberpunkTestEngine, P1 } from "../../src/testing/index.ts";

function judyScenario(p2Fixture: Parameters<typeof CyberpunkTestEngine.createWithFixture>[1]) {
  const engine = CyberpunkTestEngine.createWithFixture(
    {
      hand: [],
      field: [
        { card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt, spent: false, hasLag: false },
      ],
      eddies: 2,
      deck: [
        welcomeToNightCityRetailPlacideVoodooSentinel,
        welcomeToNightCityRetailPlacideVoodooSentinel,
        welcomeToNightCityRetailPlacideVoodooSentinel,
        welcomeToNightCityRetailPlacideVoodooSentinel,
        welcomeToNightCityRetailPlacideVoodooSentinel,
      ],
    },
    p2Fixture,
  );
  return buildDecisionContext(engine.getLocalEngine(), P1, () => 0.5);
}

describe("tactical — self-deck reveal activations", () => {
  it("activates Judy when attacking is clearly blocked and the top card is a big Unit", () => {
    const ctx = judyScenario({
      field: [{ card: welcomeToNightCityRetailMaxtacSuppressionTeam, spent: false, hasLag: false }],
    });

    const decision = tacticalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("activateAbility");
    expect(decision.args?.abilityIndex).toBe(0);
  });

  it("still prefers a good direct attack over the activation", () => {
    const ctx = judyScenario({
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });

    const decision = tacticalStrategy.decideAction(ctx);
    expect(decision.kind).toBe("command");
    if (decision.kind !== "command") return;
    expect(decision.move).toBe("attackRival");
  });
});
