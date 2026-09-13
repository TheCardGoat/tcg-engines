import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/crash-site-salvage.generated.ts";

import { goAgain, scrap } from "../shared/keywords.ts";

export const crashSiteSalvage = definePitchFamily(fabPitchFamilies["crash-site-salvage"], {
  keywords: [scrap, goAgain],
  abilities: () => ({
    whenAttacksIfScrappedGetsGoAgainIfCog: {
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
              duration: "this-turn",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "scrappedCard",
                filter: { nameContains: "Cog" },
              },
              then: {
                type: "create-token",
                token: "gold",
                controller: "controller",
              },
            },
          ],
        },
      },
    },
  }),
});
export const { yellow: crashSiteSalvageYellow } = crashSiteSalvage.cards;
