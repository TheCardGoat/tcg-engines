import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/longsword-leggings.generated.ts";

export const longswordLeggings = defineCard(
  fabCardIdentitiesByCanonicalId["6tr7pJgCdgwkQ79TmpcnF"],
  {
    keywords: [battleworn],
    abilities: {
      actionDestroyCreateBladeDanceFlurryToken: {
        kind: "activated",
        abilityType: "action",
        cost: { class: "effect", type: "destroy-self" },
        effect: {
          type: "choose-and-create-token",
          options: ["blade-dance", "flurry"],
          chooser: "controller",
          controller: "controller",
        },
      },
    },
  },
);
