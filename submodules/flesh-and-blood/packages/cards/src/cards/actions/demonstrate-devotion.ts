import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/demonstrate-devotion.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const demonstrateDevotion = definePitchFamily(fabPitchFamilies["demonstrate-devotion"], {
  keywords: [goAgain],
  abilities: () => ({
    ifControl2MoreDraconicChainLinksGetsGo: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: { typeBox: { supertypes: ["Draconic"] } },
        },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenAttacksHeroCreateFealtyToken",
                text: "",
                trigger: {
                  kind: "event",
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
                    target: {
                      kind: "hero",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "create-token",
                    token: "fealty",
                    controller: "controller",
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});
export const { red: demonstrateDevotionRed } = demonstrateDevotion.cards;
