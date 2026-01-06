import { describe, expect, it } from "bun:test";
import { annaHeirToArendelle } from "./035-anna-heir-to-arendelle";

describe("Anna - Heir to Arendelle", () => {
  it("has triggered ability with Elsa condition and restriction effect", () => {
    expect(annaHeirToArendelle.abilities).toHaveLength(1);
    const ability = annaHeirToArendelle.abilities[0];

    // Verify ability type and name
    expect(ability.type).toBe("triggered");
    expect(ability.name).toBe("LOVING HEART");

    // Verify trigger is "when you play this character"
    expect(ability.trigger).toMatchObject({
      event: "play",
      timing: "when",
      on: "SELF",
    });

    // Verify condition checks for Elsa
    expect(ability.condition).toMatchObject({
      type: "has-named-character",
      name: "Elsa",
      controller: "you",
    });

    // Verify effect is a restriction
    expect(ability.effect?.type).toBe("restriction");
    expect(ability.effect?.restriction).toBe("cant-ready");
    expect(ability.effect?.duration).toBe("next-turn");

    // Verify target is opposing character
    expect(ability.effect?.target).toMatchObject({
      selector: "chosen",
      count: 1,
      controller: "opponent",
      cardTypes: ["character"],
    });
  });
});
