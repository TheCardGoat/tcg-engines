import { describe, expect, it } from "bun:test";
import { maximusRelentlessPursuer } from "./011-maximus-relentless-pursuer";

describe("Maximus - Relentless Pursuer", () => {
  it("has Rush keyword and Horse Kick triggered ability", () => {
    expect(maximusRelentlessPursuer.abilities).toHaveLength(2);

    // Biome-ignore lint/style/noNonNullAssertion: length check above guarantees existence
    const rushAbility = maximusRelentlessPursuer.abilities![0] as {
      type: string;
      keyword: string;
    };
    // Verify Rush keyword
    expect(rushAbility.type).toBe("keyword");
    expect(rushAbility.keyword).toBe("Rush");

    // Biome-ignore lint/style/noNonNullAssertion: length check above guarantees existence
    const horseKickAbility = maximusRelentlessPursuer.abilities![1] as {
      type: string;
      name: string;
      trigger: unknown;
      effect: unknown;
    };
    // Verify Horse Kick triggered ability
    expect(horseKickAbility.type).toBe("triggered");
    expect(horseKickAbility.name).toBe("HORSE KICK");

    // Verify trigger is "when you play this character"
    expect(horseKickAbility.trigger).toMatchObject({
      event: "play",
      on: "SELF",
      timing: "when",
    });

    // Verify effect is strength debuff
    expect(horseKickAbility.effect).toMatchObject({
      duration: "this-turn",
      modifier: -2,
      stat: "strength",
      target: "CHOSEN_CHARACTER",
      type: "modify-stat",
    });
  });
});
