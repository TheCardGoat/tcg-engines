import { arcaneBarrier } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/storm-striders.generated.ts";

export const stormStriders = defineCard(fabCardIdentitiesByCanonicalId["hpMnhtBmjM7zFBTDMkf87"], {
  keywords: [arcaneBarrier(2)],
  abilities: {
    instantDestroyStormStridersMayPlayNextWizardNon: {
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
        type: "optional",
        effect: {
          type: "play-card",
          fromZones: ["hand"],
          source: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["hand"],
            count: 1,
            filter: {
              typeBox: {
                supertypes: ["Wizard"],
                types: ["Action"],
                excludeSubtypes: ["Attack"],
              },
            },
          },
          appliesTo: {
            next: {
              typeBox: {
                supertypes: ["Wizard"],
                types: ["Action"],
                excludeSubtypes: ["Attack"],
              },
            },
          },
          duration: "this-turn",
          asType: "instant",
        },
      },
    },
  },
});
