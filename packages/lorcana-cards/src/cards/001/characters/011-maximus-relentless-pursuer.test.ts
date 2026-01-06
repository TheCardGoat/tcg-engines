import { describe, expect, it } from "bun:test";
import { maximusRelentlessPursuer } from "./011-maximus-relentless-pursuer";

describe("Maximus - Relentless Pursuer", () => {
  it("has Rush keyword and Horse Kick triggered ability", () => {
    expect(maximusRelentlessPursuer.abilities).toHaveLength(2);

    // Verify Rush keyword
    const rushAbility = maximusRelentlessPursuer.abilities[0];
    expect(rushAbility.type).toBe("keyword");
    expect(rushAbility.keyword).toBe("Rush");

    // Verify Horse Kick triggered ability
    const horseKickAbility = maximusRelentlessPursuer.abilities[1];
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
