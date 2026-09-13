import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/steadfast.generated.ts";

export const steadfast = definePitchFamily(fabPitchFamilies.steadfast, {
  parameters: pitchMap({ red: 6, yellow: 5, blue: 4 }),
  abilities: (amount) => ({
    preventNextDamage: {
      type: "prevention",
      preventionKind: "shielding",
      amount,
      shielded: { selector: "controller" },
      source: {
        selector: "object",
        declared: "at-resolution",
        player: "opponent",
        zones: ["combat-chain"],
        count: 1,
      },
      duration: "this-turn",
    },
  }),
});

export const { red: steadfastRed, yellow: steadfastYellow, blue: steadfastBlue } = steadfast.cards;
