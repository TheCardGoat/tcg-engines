import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/put-em-in-their-place.generated.ts";

export const putEmInTheirPlace = definePitchFamily(fabPitchFamilies["put-em-in-their-place"], {
  keywords: [
    {
      name: "specialization",
      hero: "Valda",
    },
  ],
  abilities: () => ({
    deals4MoreDamageDiscardHandThenDrawMany: crushAbility({
      effect: {
        type: "sequence",
        steps: [
          {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["hand"],
              count: {
                type: "all",
              },
            },
          },
          {
            type: "draw",
            count: {
              type: "count",
              what: "discarded-this-way",
            },
            player: "attack-target",
          },
        ],
      },
    }),
  }),
});

export const { red: putEmInTheirPlaceRed } = putEmInTheirPlace.cards;
