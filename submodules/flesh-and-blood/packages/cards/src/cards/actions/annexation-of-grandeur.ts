import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/annexation-of-grandeur.generated.ts";

import { crushAbility } from "@tcg/flesh-and-blood-types";

export const annexationOfGrandeur = definePitchFamily(fabPitchFamilies["annexation-of-grandeur"], {
  abilities: () => ({
    crushGainControlOfGuardianAura: crushAbility({
      effect: {
        type: "gain-control",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
          },
          count: 1,
        },
        controller: "controller",
      },
      observes: {
        kind: "event-object",
        selector: "damage-source",
        relationship: {
          kind: "any",
        },
        filter: {
          typeBox: {
            supertypes: ["Guardian"],
          },
        },
      },
    }),
  }),
});
export const { yellow: annexationOfGrandeurYellow } = annexationOfGrandeur.cards;
