import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/twelve-petal-k-ya.generated.ts";

export const twelvePetalKYa = defineCard(fabCardIdentitiesByCanonicalId["kQcrWWddhc7qJJrtdpggp"], {
  keywords: [bladeBreak],
  abilities: {
    wheneverTranscendMayGain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "transcend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "gain-resources",
            amount: 1,
          },
        },
      },
    },
    instantDestroyCreateZenStateToken: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "chi",
            amount: 3,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "create-token",
        token: "zen-state",
        controller: "controller",
      },
    },
  },
});
