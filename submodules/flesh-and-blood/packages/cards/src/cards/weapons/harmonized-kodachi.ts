import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/harmonized-kodachi.generated.ts";

export const harmonizedKodachi = defineCard(
  fabCardIdentitiesByCanonicalId["gTNzqJLcQhkLkhBwKrpBQ"],
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
      pitchZoneCost0AttacksGetGoAgain: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "zone-count",
          zone: "pitch",
          player: "controller",
          filter: {
            cost: {
              op: "eq",
              value: 0,
            },
          },
          comparison: {
            op: "gte",
            value: 1,
          },
        },
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
