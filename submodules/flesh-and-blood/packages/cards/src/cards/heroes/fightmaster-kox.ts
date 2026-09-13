import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/fightmaster-kox.generated.ts";

export const fightmasterKox = defineCard(fabCardIdentitiesByCanonicalId["rd8gCbPjLCWcPLdqbMRWm"], {
  abilities: {
    actionTapDestroyGoldLookTop3EventDeckThenPutBackAnyOrderGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "destroy",
            filter: {
              name: "Gold",
            },
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              zones: ["deck"],
              filter: {
                unsupported: {
                  kind: "unparsed-filter",
                  fragments: ["event-deck"],
                },
              },
              position: "top",
              count: 3,
            },
          },
          {
            type: "move-card",
            target: {
              selector: "binding",
              binding: "them",
            },
            to: {
              zone: "deck",
              position: "top",
            },
          },
        ],
      },
    },
  },
});
