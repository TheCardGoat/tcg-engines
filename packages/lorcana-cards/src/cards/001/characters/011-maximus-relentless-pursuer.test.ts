import { describe, expect, it } from "bun:test";
import { maximusRelentlessPursuer } from "./011-maximus-relentless-pursuer";

describe("Maximus - Relentless Pursuer", () => {
  it("has Rush keyword and Horse Kick triggered ability", () => {
    expect(maximusRelentlessPursuer.abilities).toHaveLength(2);

    // biome-ignore lint/style/noNonNullAssertion: length check above guarantees existence
    const rushAbility = maximusRelentlessPursuer.abilities![0] as {
      type: string;
      keyword: string;
    };
    // Verify Rush keyword
    expect(rushAbility.type).toBe("keyword");
    expect(rushAbility.keyword).toBe("Rush");

    // biome-ignore lint/style/noNonNullAssertion: length check above guarantees existence
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
      timing: "when",
      on: "SELF",
    });

    // Verify effect is strength debuff
    expect(horseKickAbility.effect).toMatchObject({
      type: "modify-stat",
      stat: "strength",
      modifier: -2,
      duration: "this-turn",
      target: "CHOSEN_CHARACTER",
    });
  });
});
