import { describe, expect, it } from "vite-plus/test";

import { getStrategyById } from "../engine";
import { resolveFixtureAiOptions } from "./TestFixture.page";

describe("TestFixturePage AI query options", () => {
  it("uses the default strategy for the opponent seat by default", () => {
    const strategy = getStrategyById("default")?.strategy;

    expect(resolveFixtureAiOptions("")).toEqual({
      initialAi: { player: null, opponent: strategy },
      initialHumanSide: undefined,
      initialAiMode: "auto",
      initialAiSpeed: "balanced",
    });
  });

  it("keeps fixture AI disabled when requested", () => {
    expect(resolveFixtureAiOptions("?ai=off")).toEqual({
      initialAi: { player: null, opponent: null },
      initialHumanSide: undefined,
      initialAiMode: "auto",
      initialAiSpeed: "balanced",
    });
  });

  it("supports unattended AI on both seats", () => {
    const strategy = getStrategyById("default")?.strategy;
    const options = resolveFixtureAiOptions("?ai=both&ai-mode=auto&ai-speed=fast");

    expect(options.initialAi).toEqual({ player: strategy, opponent: strategy });
    expect(options.initialHumanSide).toBeUndefined();
    expect(options.initialAiMode).toBe("auto");
    expect(options.initialAiSpeed).toBe("fast");
  });

  it("supports named strategy shorthand for the opponent seat", () => {
    const strategy = getStrategyById("greedy")?.strategy;
    const options = resolveFixtureAiOptions("?ai=greedy&ai-mode=step&ai-speed=slow");

    expect(options.initialAi).toEqual({ player: null, opponent: strategy });
    expect(options.initialHumanSide).toBeUndefined();
    expect(options.initialAiMode).toBe("step");
    expect(options.initialAiSpeed).toBe("slow");
  });

  it("can drive the player seat while the human inspects opponent perspective", () => {
    const strategy = getStrategyById("first-legal")?.strategy;
    const options = resolveFixtureAiOptions("?ai=player&botStrategyId=first-legal");

    expect(options.initialAi).toEqual({ player: strategy, opponent: null });
    expect(options.initialHumanSide).toBe("opponent");
  });
});
