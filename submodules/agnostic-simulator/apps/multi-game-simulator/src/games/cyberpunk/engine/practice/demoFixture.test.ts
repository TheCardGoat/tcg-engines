import { describe, expect, it } from "vitest";
import { recommendedBotLabDeckIds } from "@tcg/cyberpunk-utils";
import {
  boundDeckProfile,
  getSafeAutomatedActionStrategyOption,
  isTacticalAIStrategy,
} from "@tcg/cyberpunk-engine";
import { findStrategyDescriptor } from "../index";
import { createDemoPracticeMatchConfig } from "./demoFixture";
import { createPracticeAiConfig, createPracticeEngine } from "./practiceEngine";

describe("Cyberpunk demo fixture", () => {
  it("starts a playable match with independent recommended decks and a bot", () => {
    const draws = [0, 0.99];
    const config = createDemoPracticeMatchConfig(() => draws.shift()!);

    expect(config.playerDeckFixtureId).toBe(recommendedBotLabDeckIds[0]);
    expect(config.botDeckFixtureId).toBe(recommendedBotLabDeckIds.at(-1));
    expect(config.playerStrategyId).toBeNull();
    expect(config.botStrategyId).toBe("default");
    const opponent = createPracticeAiConfig(config).opponent;
    expect(opponent).not.toBeNull();
    expect(opponent?.name).toBe("default");
    expect(findStrategyDescriptor(opponent)?.label).toBe("Recommended");
    expect(boundDeckProfile(opponent)).toBeUndefined();
    expect(findStrategyDescriptor(opponent)?.description).toContain("Sees both hands");
    expect(getSafeAutomatedActionStrategyOption("default").informationPolicy).toBe("oracle");
    expect(isTacticalAIStrategy(opponent)).toBe(
      isTacticalAIStrategy(getSafeAutomatedActionStrategyOption("default").strategy),
    );
    expect(() => createPracticeEngine(config)).not.toThrow();
  });

  it("allows a mirror match", () => {
    const config = createDemoPracticeMatchConfig(() => 0);
    expect(config.playerDeckFixtureId).toBe(config.botDeckFixtureId);
    expect(() => createPracticeEngine(config)).not.toThrow();
  });
});
