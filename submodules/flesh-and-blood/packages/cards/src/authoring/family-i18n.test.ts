import { describe, expect, it } from "vitest";

import { defineFamilyI18n } from "./family-i18n.ts";
import { definePitchFamily, modalAbility, pitchMap } from "./pitch-family.ts";

describe("family localization authoring", () => {
  it("emits parameterized semantic ability and mode overrides for every variant", () => {
    const family = definePitchFamily(
      {
        slug: "localized-family",
        shared: {
          typeBox: { metatypes: [], supertypes: [], types: ["Action"], subtypes: [] },
        },
        variants: {
          red: { canonicalId: "localized-red", slug: "localized-family-red" },
          yellow: { canonicalId: "localized-yellow", slug: "localized-family-yellow" },
          blue: { canonicalId: "localized-blue", slug: "localized-family-blue" },
        },
      },
      {
        parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
        abilities: () => ({
          chooseEffect: modalAbility({
            kind: "modal",
            modal: { choose: 1 },
            modes: {
              drawCard: { type: "draw", count: 1, player: "controller" },
              discardCard: {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                },
              },
            },
          }),
        }),
      },
    );

    const localized = defineFamilyI18n(family, {
      en: {
        name: (_power, variant) => `Localized ${variant}`,
        typeText: "Action",
        abilities: (power) => ({
          chooseEffect: {
            text: `Choose an effect for ${power}.`,
            modes: { drawCard: "Draw", discardCard: "Discard" },
          },
        }),
      },
    });

    expect(localized.cards.red.locales.en.abilities).toEqual({
      chooseEffect: {
        text: "Choose an effect for 3.",
        modes: { drawCard: "Draw", discardCard: "Discard" },
      },
    });
    expect(localized.cards.blue.locales.en.name).toBe("Localized blue");
    expect(localized.cards.blue.locales.en.abilities?.chooseEffect?.text).toBe(
      "Choose an effect for 1.",
    );
  });
});
