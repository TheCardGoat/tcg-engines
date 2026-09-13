import { cloaked } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/enigma-new-moon.generated.ts";

export const enigmaNewMoon = defineCard(fabCardIdentitiesByCanonicalId["9HfDfRR8m8cLKDdg88gjm"], {
  abilities: {
    equipmentGetsCloaked: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: cloaked,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          // Equipment you own: owner-aligned. permanent expands to arena +
          // equipment seats (CR arena permanents).
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
    },
    instantChiChiChiTurnTargetFaceDownEquipmentEquippedFaceUpWardCreate3SpectralShieldTokens: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "asset",
        type: "chi",
        amount: 3,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "turn-face-up",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                },
                hasStatus: "face-down",
              },
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                hasKeyword: "ward",
              },
            },
            then: {
              type: "create-token",
              token: "spectral-shield",
              controller: "controller",
              count: 3,
            },
          },
        ],
      },
    },
  },
});
