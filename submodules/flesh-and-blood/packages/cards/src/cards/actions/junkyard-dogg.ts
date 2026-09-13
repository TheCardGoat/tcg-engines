import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/junkyard-dogg.generated.ts";
import { scrap } from "../shared/keywords.ts";

export const junkyardDogg = definePitchFamily(fabPitchFamilies["junkyard-dogg"], {
  keywords: [scrap],
  abilities: () => ({
    triggeredAttackCompareAmountCountModifyNumericPowerThisTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
        state: {
          type: "compare-amount",
          amount: {
            type: "count",
            what: "cards-scrapped-by-this",
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const {
  red: junkyardDoggRed,
  yellow: junkyardDoggYellow,
  blue: junkyardDoggBlue,
} = junkyardDogg.cards;
