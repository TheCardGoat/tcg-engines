import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scrap-harvester.generated.ts";
import { scrap } from "../shared/keywords.ts";

export const scrapHarvester = definePitchFamily(fabPitchFamilies["scrap-harvester"], {
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
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Item"],
              },
              hasKeyword: "crank",
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const {
  red: scrapHarvesterRed,
  yellow: scrapHarvesterYellow,
  blue: scrapHarvesterBlue,
} = scrapHarvester.cards;
