import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/disenchantment-of-the-old-ones.generated.ts";

import { crushAbility } from "@tcg/flesh-and-blood-types";

import { heave } from "../shared/keywords.ts";

export const disenchantmentOfTheOldOnes = definePitchFamily(
  fabPitchFamilies["disenchantment-of-the-old-ones"],
  {
    keywords: [heave(2)],
    abilities: () => ({
      crushDestroyAllGuardianAuras: crushAbility({
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attack-target",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: {
              type: "all",
            },
          },
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
  },
);
export const { red: disenchantmentOfTheOldOnesRed } = disenchantmentOfTheOldOnes.cards;
