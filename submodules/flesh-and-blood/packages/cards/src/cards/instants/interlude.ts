import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/interlude.generated.ts";

export const interlude = definePitchFamily(fabPitchFamilies.interlude, {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    protectHero: {
      type: "prevention",
      preventionKind: "fixed",
      amount,
      times: 1,
      shielded: {
        selector: "any-hero",
      },
      duration: "this-turn",
      additionalModification: {
        type: "conditional",
        condition: {
          type: "target-exists",
          target: {
            selector: "hero",
            who: "another-hero",
          },
        },
        then: {
          type: "create-token",
          token: "copper",
          controller: "controller",
        },
      },
    },
  }),
});

export const { red: interludeRed, yellow: interludeYellow, blue: interludeBlue } = interlude.cards;
