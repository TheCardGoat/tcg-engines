import { describe, expect, it } from "bun:test";
import { annaHeirToArendelle } from "./035-anna-heir-to-arendelle";

describe("Anna - Heir to Arendelle", () => {
  it("has triggered ability with Elsa condition and restriction effect", () => {
    expect(annaHeirToArendelle.abilities).toHaveLength(1);
    // Biome-ignore lint/style/noNonNullAssertion: length check above guarantees existence
    const ability = annaHeirToArendelle.abilities![0] as {
      type: string;
      name: string;
      trigger: unknown;
      condition: unknown;
      effect?: {
        type: string;
        restriction: string;
        duration: string;
        target: unknown;
      };
    };

    // Verify ability type and name
    expect(ability.type).toBe("triggered");
    expect(ability.name).toBe("LOVING HEART");

    // Verify trigger is "when you play this character"
    expect(ability.trigger).toMatchObject({
      event: "play",
      on: "SELF",
      timing: "when",
    });

    // Verify condition checks for Elsa
    expect(ability.condition).toMatchObject({
      controller: "you",
      name: "Elsa",
      type: "has-named-character",
    });

    // Verify effect is a restriction
    expect(ability.effect?.type).toBe("restriction");
    expect(ability.effect?.restriction).toBe("cant-ready");
    expect(ability.effect?.duration).toBe("until-start-of-next-turn");

    // Verify target is opposing character
    expect(ability.effect?.target).toMatchObject({
      count: 1,
      owner: "opponent",
      selector: "chosen",
    });
  });
});
