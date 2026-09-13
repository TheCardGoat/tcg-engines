import { battleworn } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/comeback-kicks.generated.ts";

export const comebackKicks = defineCard(fabCardIdentitiesByCanonicalId["6fPwHjKFPwPTCfRgmrkB9"], {
  keywords: [battleworn],
  abilities: {
    wheneverCrowdCheersIfHaveLessThanEachOther: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "crowd-cheers",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "life-comparison",
          player: "self",
          vs: "each-other-hero",
          op: "lt",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
          then: {
            type: "gain-action-points",
            amount: 1,
          },
        },
      },
    },
  },
});
