import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scrap-hopper.generated.ts";
import { scrap } from "../shared/keywords.ts";

export const scrapHopper = definePitchFamily(fabPitchFamilies["scrap-hopper"], {
  keywords: [scrap],
  abilities: () => ({
    triggeredStaticOnAttackEffect: {
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
          type: "create-token",
          token: "quicken",
          controller: "controller",
        },
      },
    },
  }),
});

export const {
  red: scrapHopperRed,
  yellow: scrapHopperYellow,
  blue: scrapHopperBlue,
} = scrapHopper.cards;
