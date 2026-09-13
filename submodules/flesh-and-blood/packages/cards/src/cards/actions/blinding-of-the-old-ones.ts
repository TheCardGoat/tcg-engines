import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blinding-of-the-old-ones.generated.ts";

import { crushAbility } from "@tcg/flesh-and-blood-types";

import { heave } from "../shared/keywords.ts";

export const blindingOfTheOldOnes = definePitchFamily(
  fabPitchFamilies["blinding-of-the-old-ones"],
  {
    keywords: [heave(2)],
    abilities: () => ({
      crushRemoveGuardianAbilitiesNextTurn: crushAbility({
        effect: {
          type: "remove-property",
          property: {
            kind: "abilities",
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent", "combat-chain", "stack"],
            count: {
              type: "all",
            },
          },
          duration: "until-end-of-next-turn",
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
export const { red: blindingOfTheOldOnesRed } = blindingOfTheOldOnes.cards;
