import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/wash-away.generated.ts";

export const washAway = definePitchFamily(fabPitchFamilies["wash-away"], {
  abilities: () => ({
    gainDefenseAfterPlayingBlue: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-another-blue-card",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { blue: washAwayBlue } = washAway.cards;
