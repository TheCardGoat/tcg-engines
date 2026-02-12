import { describe, expect, it } from "bun:test";
import { timonGrubRustler } from "./024-timon-grub-rustler";

describe("Timon - Grub Rustler", () => {
  it("has optional remove-damage triggered ability when played", () => {
    expect(timonGrubRustler.abilities).toHaveLength(1);
    // Biome-ignore lint/style/noNonNullAssertion: length check above guarantees existence
    const ability = timonGrubRustler.abilities![0] as {
      type: string;
      name: string;
      trigger: unknown;
      effect?: {
        type: string;
        effect: unknown;
        chooser: string;
      };
    };

    // Verify ability type and name
    expect(ability.type).toBe("triggered");
    expect(ability.name).toBe("TASTES LIKE CHICKEN");

    // Verify trigger is "when you play this character"
    expect(ability.trigger).toMatchObject({
      event: "play",
      on: "SELF",
      timing: "when",
    });

    // Verify effect is optional
    expect(ability.effect?.type).toBe("optional");

    // Verify nested effect is remove-damage
    expect(ability.effect?.effect).toMatchObject({
      amount: 1,
      target: "CHOSEN_CHARACTER",
      type: "remove-damage",
      upTo: true,
    });

    // Verify chooser is controller
    expect(ability.effect?.chooser).toBe("CONTROLLER");
  });
});
