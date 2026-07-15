import { describe, expect, it } from "bun:test";
import { stitchCarefreeSurfer } from "./021-stitch-carefree-surfer";

describe("Stitch - Carefree Surfer", () => {
  it("has conditional draw ability when played (OHANA)", () => {
    expect(stitchCarefreeSurfer.abilities).toHaveLength(1);
    // Biome-ignore lint/style/noNonNullAssertion: length check above guarantees existence
    const ability = stitchCarefreeSurfer.abilities![0] as {
      type: string;
      name: string;
      trigger: unknown;
      effect?: {
        type: string;
        condition: unknown;
        then: unknown;
      };
    };

    // Verify ability type and name
    expect(ability.type).toBe("triggered");
    expect(ability.name).toBe("OHANA");

    // Verify trigger is "when you play this character"
    expect(ability.trigger).toMatchObject({
      event: "play",
      on: "SELF",
      timing: "when",
    });

    // Verify effect is conditional
    expect(ability.effect?.type).toBe("conditional");

    // Verify condition checks for 2+ other characters in play
    expect(ability.effect?.condition).toMatchObject({
      comparison: "greater-or-equal",
      controller: "you",
      count: 2,
      type: "has-character-count",
    });

    // Verify then clause is optional draw
    expect(ability.effect?.then).toMatchObject({
      chooser: "CONTROLLER",
      effect: {
        amount: 2,
        type: "draw",
      },
      type: "optional",
    });
  });
});
