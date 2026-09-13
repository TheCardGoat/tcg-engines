import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/cogwerx-blunderbuss.generated.ts";

export const cogwerxBlunderbuss = defineCard(
  fabCardIdentitiesByCanonicalId["mpNCNfJnPMdk9bgrkj8bB"],
  {
    abilities: {
      actionResourceResourceTapAttack: {
        kind: "activated",
        abilityType: "attack",
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
          ],
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      instantTapCogNextAttackTurnGetsGoAgain: {
        kind: "activated",
        abilityType: "instant",
        cost: {
          class: "effect",
          type: "tap",
          filter: {
            typeBox: {
              subtypes: ["Cog"],
            },
          },
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
          },
        },
      },
    },
  },
);
