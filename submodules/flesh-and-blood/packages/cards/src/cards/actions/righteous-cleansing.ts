import { crushAbility } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/righteous-cleansing.generated.ts";

export const righteousCleansing = definePitchFamily(fabPitchFamilies["righteous-cleansing"], {
  abilities: () => ({
    deals4MoreDamageLookTop5DeckBanish1MoreSameNameAmongThenPutRestTopDeckAnyOrder: crushAbility({
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-same-name-group",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "attack-target",
              zones: ["deck"],
              position: "top",
              count: 5,
            },
            selectedBinding: "banished-this-way",
            orderedRemainderBinding: "ordered-remainder",
          },
        ],
      },
    }),
  }),
});

export const { yellow: righteousCleansingYellow } = righteousCleansing.cards;
