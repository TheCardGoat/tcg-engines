// @ts-nocheck - Skipped tests contain expected values that don't match current types
import { describe, expect, it } from "bun:test";
import {
  Abilities,
  Conditions,
  Costs,
  Effects,
  Targets,
  Triggers,
} from "@tcg/lorcana-types";
import { parseAbilityTextMulti } from "../../parser";

describe("Set 004 Card Text Parser Tests - Actions Items", () => {
  it.skip("Swing into Action: should parse card text", () => {
    const text =
      "Chosen character gains Rush this turn. (They can challenge the turn they're played.)";
    const result = parseAbilityTextMulti(text);
    expect(result.success).toBe(true);
    expect(result.abilities.length).toBe(1);

    const swingIntoAction = {
      type: "action",
      effect: {
        type: "gain-keyword",
      },
    };
    expect(result.abilities[0].ability).toEqual(
      expect.objectContaining(swingIntoAction),
    );
  });
});
