import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/plasma-barrel-shot.generated.ts";

export const plasmaBarrelShot = defineCard(
  fabCardIdentitiesByCanonicalId["KPMtkfh8Dd6Dt9LJjGQLw"],
  {
    abilities: {
      oncePerTurnActionRemoveSteamCounterPlasmaBarrelShotAttack: {
        kind: "activated",
        limit: {
          count: 1,
          per: "turn",
        },
        abilityType: "attack",
        cost: {
          class: "effect",
          type: "remove-counters",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
        },
        effect: {
          type: "attack-with",
          target: {
            selector: "self",
          },
        },
      },
      actionResourceResourceThereNoSteamCountersPlasmaBarrelShotPutSteamCounterGoAgain: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 2,
        },
        layerKeywords: [goAgain],
        effect: {
          type: "conditional",
          condition: {
            type: "has-counter",
            counter: {
              kind: "named",
              name: "steam",
            },
            target: {
              selector: "self",
            },
            comparison: {
              op: "eq",
              value: 0,
            },
          },
          then: {
            type: "add-counter",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
      xEqual1PlusNumberTimesBoostedCombatChain: {
        kind: "static",
        staticKind: "meta",
      },
    },
  },
);
