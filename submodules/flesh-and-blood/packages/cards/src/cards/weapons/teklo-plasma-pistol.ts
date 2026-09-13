import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/teklo-plasma-pistol.generated.ts";

export const tekloPlasmaPistol = defineCard(
  fabCardIdentitiesByCanonicalId["fNFqtdWLq6tCPnnwjLLWL"],
  {
    abilities: {
      actionRemoveSteamCounterTekloPlasmaPistolAttack: {
        kind: "activated",
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
      actionResourceThereNoSteamCountersTekloPlasmaPistolPutSteamCounterGoAgain: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
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
    },
  },
);
