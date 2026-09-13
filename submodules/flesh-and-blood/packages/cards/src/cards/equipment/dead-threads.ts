import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/dead-threads.generated.ts";

export const deadThreads = defineCard(fabCardIdentitiesByCanonicalId["nQLzhKtPNctwzTqMNf7LJ"], {
  keywords: [bladeBreak],
  abilities: {
    instantGainActivateOnlyIfAllyHasBeenPut: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      // Event window: per:turn walks history.moves into GY this turn (not
      // current occupancy). Ally is FAB_SUBTYPES — types:["Ally"] never matches.
      condition: {
        type: "zone-count",
        zone: "graveyard",
        player: "controller",
        filter: {
          typeBox: {
            subtypes: ["Ally"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
        per: "turn",
      },
      effect: {
        type: "gain-resources",
        amount: 1,
      },
    },
  },
});
