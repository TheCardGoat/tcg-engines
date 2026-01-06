import { describe, expect, it } from "bun:test";
import { stitchCarefreeSurfer } from "./021-stitch-carefree-surfer";

describe("Stitch - Carefree Surfer", () => {
  it("has conditional draw ability when played (OHANA)", () => {
    expect(stitchCarefreeSurfer.abilities).toHaveLength(1);
    const ability = stitchCarefreeSurfer.abilities[0];

    // Verify ability type and name
    expect(ability.type).toBe("triggered");
    expect(ability.name).toBe("OHANA");

    // Verify trigger is "when you play this character"
    expect(ability.trigger).toMatchObject({
      event: "play",
      timing: "when",
      on: "SELF",
    });

    // Verify effect is conditional
    expect(ability.effect?.type).toBe("conditional");

    // Verify condition checks for 3+ characters in play (including self)
    expect(ability.effect?.condition).toMatchObject({
      type: "zone-count",
      zone: "play",
      player: "you",
      cardType: "character",
      comparison: {
        operator: ">=",
        value: 3,
        excludeSelf: true,
      },
    });

    // Verify then clause is optional draw
    expect(ability.effect?.then).toMatchObject({
      type: "optional",
      effect: {
        type: "draw",
        amount: 2,
      },
      chooser: "CONTROLLER",
    });
  });
});
