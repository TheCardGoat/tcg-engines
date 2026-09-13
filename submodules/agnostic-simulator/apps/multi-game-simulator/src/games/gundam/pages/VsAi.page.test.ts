import { describe, expect, it } from "vite-plus/test";

import { reconstructFromSnapshot } from "../src/game/snapshot.ts";
import { loadVsAiSnapshot } from "./VsAi.page.tsx";
import { DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID } from "@tcg/gundam-engine";

describe("Gundam named fixture loader", () => {
  it("loads a route fixture directly at its authored game point", async () => {
    const result = await loadVsAiSnapshot(
      new URL("http://localhost/gundam/simulator/tests/block-step-demo"),
      "block-step-demo",
    );

    expect(result.snapshot).not.toBeNull();
    const match = reconstructFromSnapshot(result.snapshot!);
    expect(match.fixtureName).toBe("block-step-demo");
    expect(match.hasBot).toBe(true);
    expect(match.botConfig).toEqual({
      driver: "strategy",
      strategy: DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID,
    });
    expect(match.runtime.getState().ctx.status.phase).toBe("battle-phase");
    expect(match.runtime.getState().ctx.status.step).toBe("block-step");
  });

  it("lets visual fixtures override or disable the default strategy bot", async () => {
    const overridden = await loadVsAiSnapshot(
      new URL("http://localhost/gundam/simulator/tests/st10-shield-assault-lab?strategy=tempo"),
      "st10-shield-assault-lab",
    );
    expect(overridden.snapshot?.botConfig).toEqual({
      driver: "strategy",
      strategy: "tempo",
    });

    const disabled = await loadVsAiSnapshot(
      new URL("http://localhost/gundam/simulator/tests/st10-shield-assault-lab?ai=off"),
      "st10-shield-assault-lab",
    );
    expect(disabled.snapshot?.botConfig).toBeUndefined();
    expect(disabled.snapshot?.hasBot).toBe(false);
  });

  it("rejects an unknown named fixture instead of opening the match launcher", async () => {
    await expect(
      loadVsAiSnapshot(
        new URL("http://localhost/gundam/simulator/tests/not-a-fixture"),
        "not-a-fixture",
      ),
    ).rejects.toThrow("Unknown Gundam fixture: not-a-fixture");
  });
});
