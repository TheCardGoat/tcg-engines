import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/aurora-emissary-of-lightning.generated.ts";

export const auroraEmissaryOfLightning = defineCard(
  fabCardIdentitiesByCanonicalId["WwKdgRBmtM6CpRjwM97Lh"],
  {
    abilities: {
      instantResourceResourceTapDestroyLightningFlowCreateEmbodimentLightningToken: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 2,
            },
            {
              class: "effect",
              type: "tap-self",
            },
            {
              class: "effect",
              type: "destroy",
              filter: {
                name: "Lightning Flow",
              },
            },
          ],
        },
        effect: {
          type: "create-token",
          token: "embodiment-of-lightning",
          controller: "controller",
        },
      },
    },
  },
);
