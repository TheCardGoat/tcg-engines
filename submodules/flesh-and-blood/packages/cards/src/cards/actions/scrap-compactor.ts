import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scrap-compactor.generated.ts";
import { scrap } from "../shared/keywords.ts";

export const scrapCompactor = definePitchFamily(fabPitchFamilies["scrap-compactor"], {
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
          type: "optional",
          effect: {
            type: "play-card",
            fromZones: ["hand"],
            source: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
              filter: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
            },
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Evo"],
                },
              },
            },
            duration: "this-turn",
            asType: "instant",
          },
        },
      },
    },
  }),
});

export const {
  red: scrapCompactorRed,
  yellow: scrapCompactorYellow,
  blue: scrapCompactorBlue,
} = scrapCompactor.cards;
