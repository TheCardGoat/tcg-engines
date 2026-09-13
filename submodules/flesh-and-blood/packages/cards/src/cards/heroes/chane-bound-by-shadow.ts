import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/chane-bound-by-shadow.generated.ts";

export const chaneBoundByShadow = defineCard(
  fabCardIdentitiesByCanonicalId["MhBTRHCCft7RbrMmkwwGw"],
  {
    abilities: {
      oncePerTurnActionCreateSoulShackleTokenNextRunebladeShadowActionTurnGainsGoAgainGoAgain: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "effect",
          type: "create-token",
          token: "soul-shackle",
          controller: "controller",
        },
        layerKeywords: [goAgain],
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
                types: ["Action"],
              },
              or: [
                {
                  typeBox: {
                    supertypes: ["Runeblade"],
                  },
                },
                {
                  typeBox: {
                    supertypes: ["Shadow"],
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
);
