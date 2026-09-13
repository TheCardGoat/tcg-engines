import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/coat-of-allegiance.generated.ts";

export const coatOfAllegiance = defineCard(
  fabCardIdentitiesByCanonicalId["FdMpkDBJtRgkrP6zK6rfQ"],
  {
    abilities: {
      actionDestroyGainUntilEndTurnMayOnlyPlay: {
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
              type: "gain-resources",
              amount: 1,
            },
            {
              type: "rule-modification",
              mode: "require",
              action: "play",
              filter: {
                typeBox: {
                  supertypes: ["Draconic"],
                },
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  },
);
