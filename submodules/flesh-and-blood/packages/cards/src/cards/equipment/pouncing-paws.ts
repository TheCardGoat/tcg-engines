import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/pouncing-paws.generated.ts";

export const pouncingPaws = defineCard(fabCardIdentitiesByCanonicalId["HjFKhRGTDGJDk8NGmdFjB"], {
  keywords: [battleworn],
  abilities: {
    instantDestroyCreateCrouchingTigerBanishedZoneMayPlay: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "create-token",
            token: "crouching-tiger",
            controller: "controller",
            to: {
              zone: "banished",
            },
            outputBinding: "it",
          },
          {
            type: "optional",
            effect: {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          },
        ],
      },
    },
  },
});
