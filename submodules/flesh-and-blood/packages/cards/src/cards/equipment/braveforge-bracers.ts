import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/braveforge-bracers.generated.ts";

export const braveforgeBracers = defineCard(
  fabCardIdentitiesByCanonicalId["GJBb8BW9zTQ8CkGbzFqmN"],
  {
    keywords: [battleworn],
    abilities: {
      oncePerTurnActionNextWeaponAttackTurnGains: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        condition: { type: "performed-this-turn", event: "weapon-hit", player: "controller" },
        layerKeywords: [goAgain],
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 1,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                types: ["Weapon"],
              },
            },
          },
        },
      },
    },
  },
);
