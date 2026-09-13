import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/starting-stake.generated.ts";

export const startingStake = definePitchFamily(fabPitchFamilies["starting-stake"], {
  abilities: () => ({
    controlNoGoldTokensCreateGoldToken: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "permanent",
        player: "controller",
        filter: {
          name: "Gold",
          typeBox: {
            metatypes: ["Token"],
          },
        },
        comparison: {
          op: "eq",
          value: 0,
        },
      },
      effect: {
        type: "create-token",
        token: "gold",
        controller: "controller",
      },
    },
  }),
});

export const { yellow: startingStakeYellow } = startingStake.cards;
