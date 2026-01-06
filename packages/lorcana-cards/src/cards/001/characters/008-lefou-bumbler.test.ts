import { describe, expect, it } from "bun:test";
import { lefouBumbler } from "./008-lefou-bumbler";

describe("LeFou - Bumbler", () => {
  it("has LOYAL cost reduction ability with Gaston condition", () => {
    // Verify the ability exists
    expect(lefouBumbler.abilities).toHaveLength(1);
    const ability = lefouBumbler.abilities[0];

    // Verify ability type and name
    expect(ability.type).toBe("static");
    expect(ability.name).toBe("LOYAL");

    // Verify effect is cost reduction
    expect(ability.effect?.type).toBe("cost-reduction");
    expect(ability.effect?.amount).toBe(1);

    // Verify condition checks for Gaston
    expect(ability.condition?.type).toBe("has-named-character");
    expect(ability.condition?.name).toBe("Gaston");
  });
});
