import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/scurv-stowaway.generated.ts";

export const scurvStowaway = defineCard(fabCardIdentitiesByCanonicalId["gKgfQDwNnGH8GtfL9RkPG"], {
  keywords: [goAgain],
  abilities: {
    actionTapDestroyGoldCreateGoldkissRumTokenGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "tap-self",
          },
          {
            class: "effect",
            type: "destroy",
            filter: {
              name: "Gold",
            },
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        token: "goldkiss-rum",
        controller: "controller",
      },
    },
    wheneverActivateGoldkissRumGainResource: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "activate",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "activated-card",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Goldkiss Rum",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
    },
  },
});
