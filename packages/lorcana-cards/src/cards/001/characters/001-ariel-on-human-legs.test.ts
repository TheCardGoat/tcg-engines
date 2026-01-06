import { describe, expect, it } from "bun:test";
import { arielOnHumanLegs } from "./001-ariel-on-human-legs";

describe("Ariel - On Human Legs", () => {
  it("has VOICELESS restriction ability", () => {
    expect(arielOnHumanLegs.abilities).toHaveLength(1);
    const ability = arielOnHumanLegs.abilities[0];

    // Verify ability type and name
    expect(ability.type).toBe("static");
    expect(ability.name).toBe("VOICELESS");

    // Verify effect is a restriction
    expect(ability.effect?.type).toBe("restriction");
    expect(ability.effect?.restriction).toBe("cant-sing");
    expect(ability.effect?.target).toBe("SELF");
  });
});
