import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/fortitude-of-anvilheim.generated.ts";

export const fortitudeOfAnvilheim = defineCard(
  fabCardIdentitiesByCanonicalId["6BCMqFPmmMJDgMPCrKh9Q"],
  {
    keywords: [guardwell],
    abilities: {
      attackReactionHeroDestroyReturnActionDefendingWeaponAttack: {
        kind: "activated",
        abilityType: "attack-reaction",
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
              type: "tap-hero",
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        layerKeywords: [guardwell],
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            zones: ["combat-chain"],
            filter: {
              typeBox: {
                types: ["Action"],
              },
              defending: true,
              defendingAgainst: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
            },
            count: 1,
          },
          to: {
            zone: "hand",
          },
        },
      },
    },
  },
);
