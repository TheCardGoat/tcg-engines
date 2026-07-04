import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailFloorIt } from "@tcg/cyberpunk-cards";

describe("Floor It", () => {
  it("is a QUICK program whose play trigger gives a rival Unit -1 power this turn and draws 1", () => {
    const [quickAbility, playAbility] = welcomeToNightCityRetailFloorIt.abilities;
    expect(quickAbility?.kind).toBe("keyword");
    expect(quickAbility?.keyword).toBe("quick");

    expect(playAbility?.kind).toBe("triggered");
    expect(playAbility?.trigger).toMatchObject({ trigger: "play" });
    expect(playAbility?.effects.map((effect) => effect.effect)).toEqual(["modifyPower", "draw"]);

    const modifyPower = playAbility?.effects[0];
    expect(modifyPower).toMatchObject({
      value: -1,
      duration: "turn",
    });
    expect(modifyPower).toHaveProperty("target");
    // Card text targets a rival Unit.
    expect(
      (modifyPower as { target: { controller: string; cardTypes: string[] } }).target,
    ).toMatchObject({
      controller: "rival",
      cardTypes: ["unit"],
    });

    expect(playAbility?.effects[1]).toMatchObject({
      effect: "draw",
      player: "friendly",
      amount: 1,
    });
  });
});
