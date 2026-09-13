import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/relentless-pursuit.generated.ts";

export const relentlessPursuit = definePitchFamily(fabPitchFamilies["relentless-pursuit"], {
  keywords: [goAgain],
  abilities: () => ({
    markTargetOpposing: {
      kind: "resolution",
      effect: {
        type: "mark",
        target: {
          selector: "opponent",
        },
      },
      label: {
        name: "mark",
      },
    },
    attackedTurnPutBottomOwnersDeck: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "hit", player: "controller" },
      effect: {
        type: "move-card",
        target: {
          selector: "self",
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
      },
      label: {
        name: "mark",
      },
    },
  }),
});

export const { blue: relentlessPursuitBlue } = relentlessPursuit.cards;
