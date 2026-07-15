import { describe, expect, it } from "vite-plus/test";
import { prm01RebeccaHavingAMoment } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Rebecca - Having a Moment", () => {
  it("can be called and exposes no activated ability choices", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: prm01RebeccaHavingAMoment, faceDown: true }],
      eddies: 1,
    });

    engine.callLegend(prm01RebeccaHavingAMoment, { as: P1 });

    expect(engine.getCard(prm01RebeccaHavingAMoment, "legendArea", P1).meta.faceDown).toBe(false);
    expect(engine.getEddies(P1)).toBe(0);
    const activateAbility = engine
      .getPrompt(P1)
      .availableMoves.find((move) => move.moveId === "activateAbility");
    expect(
      activateAbility?.inputSpec.type === "selectAbility"
        ? activateAbility.inputSpec.candidates
        : [],
    ).toHaveLength(0);
  });
});
