import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/reach-beyond-the-grave.generated.ts";

export const reachBeyondTheGrave = defineCard(
  fabCardIdentitiesByCanonicalId["HWDPBPpKBd7kdJdHpbw9t"],
  {
    keywords: [battleworn],
    abilities: {
      actionDestroyReturnAllyFromGraveyardHandThenDiscard: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["graveyard"],
                filter: {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
                count: 1,
              },
              to: {
                zone: "hand",
              },
            },
            {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
              },
              outputBinding: "it",
            },
          ],
        },
      },
    },
  },
);
