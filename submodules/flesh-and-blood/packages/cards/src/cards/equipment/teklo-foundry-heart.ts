import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/teklo-foundry-heart.generated.ts";

export const tekloFoundryHeart = defineCard(
  fabCardIdentitiesByCanonicalId["tBqFrtGcBNQt7GnMFTPPB"],
  {
    keywords: [battleworn],
    abilities: {
      oncePerTurnActionBanishTop2DeckGain: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        condition: { type: "performed-this-turn", event: "boost", player: "controller" },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["deck"],
                position: "top",
                count: 2,
              },
              // Cohort stamped as banished-this-way for filtered count; engine
              // also always stamps banished-this-way on multi-banish.
              outputBinding: "banished-this-way",
            },
            {
              type: "gain-resources",
              amount: {
                type: "count",
                what: "banished-this-way",
                // Mechanologist is a class supertype (types filter also matches).
                filter: {
                  typeBox: {
                    supertypes: ["Mechanologist"],
                  },
                },
              },
            },
          ],
        },
      },
    },
  },
);
