import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetail6thStreetRecruits } from "@tcg/cyberpunk-cards";

describe("6th Street Recruits", () => {
  it("triggers when a friendly Unit steals a d6 and offers an optional +6 Gig bump", () => {
    // Printed text: "When a friendly Unit steals a d6, increase a Gig by up to 6."
    // The trigger must (a) be a gigStolen event, (b) require a friendly thief
    // Unit, (c) filter the stolen die to a d6, and (d) offer a friendly-Gig
    // adjustGig (increase, up to 6, chooseUpTo) with a decline-allowed binding.
    const ability = welcomeToNightCityRetail6thStreetRecruits.abilities[0]!;
    expect(ability.kind).toBe("triggered");

    expect(ability.trigger).toMatchObject({
      trigger: "event",
      event: {
        event: "gigStolen",
        player: "friendly",
        target: { selector: "gig", sides: "d6" },
        source: {
          selector: "card",
          controller: "friendly",
          zones: ["field"],
          cardTypes: ["unit"],
        },
      },
    });

    // The friendly-Gig binding must allow declining (min: 0).
    const binding = ability.bindings?.[0];
    expect(binding?.id).toBe("selectedGig");
    expect(binding?.target).toMatchObject({
      selector: "gig",
      controller: "friendly",
    });
    expect(binding?.target.selection).toEqual({ mode: "choose", min: 0, max: 1 });

    // The effect increases a friendly Gig by up to 6.
    expect(ability.effects[0]).toMatchObject({
      effect: "adjustGig",
      target: { selector: "bound", id: "selectedGig" },
      maxAmount: 6,
      direction: "increase",
      chooseUpTo: true,
    });
  });
});
