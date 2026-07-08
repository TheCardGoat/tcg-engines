import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailLizzyWizzyDelicateWeapon } from "@tcg/cyberpunk-cards";

describe("Lizzy Wizzy - Delicate Weapon", () => {
  it("allows declining the PLAY program selection (min: 0)", () => {
    // Printed text: "You **may** play a Program with cost 3 or less ...". The
    // "may" wording maps to a selection with min: 0 so the player can decline.
    const playAbility = welcomeToNightCityRetailLizzyWizzyDelicateWeapon.abilities.find(
      (ability) => ability.kind === "triggered",
    );
    expect(playAbility).toBeDefined();
    const binding = playAbility!.bindings?.[0];
    expect(binding?.id).toBe("selectedProgram");
    expect(binding?.target).toMatchObject({
      selector: "card",
      controller: "friendly",
      zones: ["hand", "trash"],
      cardTypes: ["program"],
      maxCost: 3,
    });
    expect(binding?.target.selection).toEqual({ mode: "choose", min: 0, max: 1 });
  });
});
