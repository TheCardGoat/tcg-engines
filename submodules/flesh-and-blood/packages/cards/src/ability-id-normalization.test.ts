import { describe, expect, it } from "vitest";
import { assignAbilityIds, type FleshAndBloodAbility } from "@tcg/flesh-and-blood-types";

describe("FAB ability identity normalization", () => {
  it("uses canonicalId for unstamped ability ids", () => {
    const ability = {
      id: "",
      kind: "resolution",
      text: "Draw a card.",
      effect: { type: "draw", count: 1, player: "controller" },
    } satisfies FleshAndBloodAbility;

    expect(assignAbilityIds([ability], "canonical-card")?.[0]?.id).toBe("canonical-card-a1");
  });
});
