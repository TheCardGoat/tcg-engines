import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smelting-of-the-old-ones.generated.ts";
import { heave } from "../shared/keywords.ts";

export const smeltingOfTheOldOnes = definePitchFamily(
  fabPitchFamilies["smelting-of-the-old-ones"],
  {
    keywords: [heave(2)],
    abilities: () => ({
      crushAbility: crushAbility({
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attack-target",
            zones: ["permanent"],
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
              hasCounter: "-1{d}",
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

export const { red: smeltingOfTheOldOnesRed } = smeltingOfTheOldOnes.cards;
