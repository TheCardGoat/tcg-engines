import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/grimoire-of-fellingsong.generated.ts";

export const grimoireOfFellingsong = defineCard(
  fabCardIdentitiesByCanonicalId["fjzKPPn6MD6qHWGTbwWtM"],
  {
    abilities: {
      instantDestroyCreateRunechantToken: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 1,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "create-token",
          token: "runechant",
          controller: "controller",
        },
      },
    },
  },
);
