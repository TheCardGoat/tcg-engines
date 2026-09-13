import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/hala-bladesaint-of-the-vow.generated.ts";

export const halaBladesaintOfTheVow = defineCard(
  fabCardIdentitiesByCanonicalId["FQFkLFgp9pJqdd8mQkJTQ"],
  {
    abilities: {
      actionResourceResourceResourceTapSharpenTargetSwordGoAgain: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            {
              class: "effect",
              type: "tap-self",
            },
          ],
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sharpen",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["weapon", "permanent"],
            filter: {
              typeBox: {
                subtypes: ["Sword"],
              },
            },
            count: 1,
          },
          outputBinding: "it",
        },
      },
    },
  },
);
