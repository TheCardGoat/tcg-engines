import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/quicksilver-dagger.generated.ts";

export const quicksilverDagger = defineCard(
  fabCardIdentitiesByCanonicalId["MLc97c6bqmKcPCtNg9M9q"],
  {
    abilities: {
      oncePerTurnActionResourceAttack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      anotherWeaponGainedGoAgainTurnAttacksGetGoAgain: {
        kind: "static",
        staticKind: "continuous",
        condition: { type: "another-weapon-gained-go-again-this-turn" },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: { selector: "self" },
          duration: "while-in-arena",
          appliesTo: {
            attacksOf: true,
            next: {
              typeBox: {
                types: ["Weapon"],
              },
            },
            count: { type: "all" },
            events: ["attack"],
          },
        },
      },
    },
  },
);
