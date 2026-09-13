import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chorus-of-the-amphitheater.generated.ts";

export const chorusOfTheAmphitheater = definePitchFamily(
  fabPitchFamilies["chorus-of-the-amphitheater"],
  {
    parameters: pitchMap({ red: { damage: 4 }, yellow: { damage: 3 }, blue: { damage: 2 } }),
    abilities: ({ damage }) => ({
      resolutionDealDamageArcane: {
        kind: "resolution",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: damage,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["hero", "permanent"],
            count: 1,
          },
        },
      },
      activatedInstantAmp: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "discard-self",
        },
        effect: {
          type: "amp",
          amount: 1,
          sourceFilter: {
            or: [{ typeBox: { types: ["Action"] } }, { typeBox: { types: ["Instant"] } }],
          },
        },
      },
    }),
  },
);

export const {
  red: chorusOfTheAmphitheaterRed,
  yellow: chorusOfTheAmphitheaterYellow,
  blue: chorusOfTheAmphitheaterBlue,
} = chorusOfTheAmphitheater.cards;
