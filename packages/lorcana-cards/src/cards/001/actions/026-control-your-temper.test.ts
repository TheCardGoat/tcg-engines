import { describe, expect, it } from "bun:test";
import { controlYourTemper } from "./026-control-your-temper";

describe("Control Your Temper!", () => {
  it("has strength debuff action ability", () => {
    expect(controlYourTemper.abilities).toHaveLength(1);
    // Biome-ignore lint/style/noNonNullAssertion: length check above guarantees existence
    const ability = controlYourTemper.abilities![0] as {
      type: string;
      effect?: {
        type: string;
        stat: string;
        modifier: number;
        duration: string;
        target: unknown;
      };
    };

    // Verify ability type
    expect(ability.type).toBe("action");

    // Verify effect is stat modification
    expect(ability.effect?.type).toBe("modify-stat");
    expect(ability.effect?.stat).toBe("strength");
    expect(ability.effect?.modifier).toBe(-2);
    expect(ability.effect?.duration).toBe("this-turn");

    // Verify target is chosen character
    expect(ability.effect?.target).toMatchObject({
      cardTypes: ["character"],
      count: 1,
      selector: "chosen",
    });
  });
});
