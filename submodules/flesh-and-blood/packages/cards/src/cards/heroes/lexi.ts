import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/lexi.generated.ts";

export const lexi = defineCard(fabCardIdentitiesByCanonicalId["GFc7t8wNTwC8rCFwrqTfh"], {
  keywords: [
    {
      name: "essence",
      supertypes: ["Ice", "Lightning"],
    },
  ],
  abilities: {
    oncePerTurnActionTurnFaceDownArsenalFaceUpLightningNextAttackTurnGainsGoAgainIceCreateFrostbiteTokenTargetHerosGoAgain:
      {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "effect",
          type: "turn-face-up",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["arsenal"],
            filter: {
              hasStatus: "face-down",
            },
            count: 1,
          },
          outputBinding: "it",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "sequence",
          steps: [
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    supertypes: ["Lightning"],
                  },
                },
              },
              then: {
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
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  typeBox: {
                    supertypes: ["Ice"],
                  },
                },
              },
              then: {
                // Printed "under target hero's control" — 1v1 product scope is
                // the sole opponent (multi-hero targeting is out of product scope).
                type: "create-token",
                token: "frostbite",
                controller: "opponent",
              },
            },
          ],
        },
      },
  },
});
