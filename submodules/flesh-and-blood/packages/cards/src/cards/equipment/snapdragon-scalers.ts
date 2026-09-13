import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/snapdragon-scalers.generated.ts";

export const snapdragonScalers = defineCard(
  fabCardIdentitiesByCanonicalId["gGmbgrQrzhKpFdtcRTF9h"],
  {
    abilities: {
      attackReactionDestroyTargetAttackActionCost1Less: {
        kind: "activated",
        abilityType: "attack-reaction",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: attackActionFilter({
              cost: {
                op: "lte",
                value: 1,
              },
            }),
            count: 1,
          },
          duration: "this-turn",
          outputBinding: "it",
        },
      },
    },
  },
);
