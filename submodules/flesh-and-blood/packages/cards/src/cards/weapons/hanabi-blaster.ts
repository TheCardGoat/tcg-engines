import { overpower } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/hanabi-blaster.generated.ts";

export const hanabiBlaster = defineCard(fabCardIdentitiesByCanonicalId["TbNWLjgL9QKkCMf7FJR6p"], {
  keywords: [overpower],
  abilities: {
    oncePerTurnActionRemove2SteamCountersHanabiBlasterAtttack: {
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
        count: 2,
      },
      effect: {
        type: "attack-with",
        target: {
          selector: "self",
        },
      },
    },
    thirdTimePlayBoostTurnPutSteamCounterHanabiBlaster: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              hasKeyword: "boost",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
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
      limit: {
        count: 1,
        per: "turn",
        ordinals: [3],
      },
    },
  },
});
