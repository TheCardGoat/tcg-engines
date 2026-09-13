import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/bolfar-bear-hands.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const bolfarBearHands = defineCard(fabCardIdentitiesByCanonicalId["CdFkL9pbDdFj8DKnRHHGn"], {
  abilities: {
    cantEquipWeapons: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "equip",
        filter: {
          typeBox: {
            types: ["Weapon"],
          },
        },
        duration: "while-in-arena",
      },
    },
    actionResourceResourceResourceTapNextAttackActionCrushPlayTurnAttackAdditionalGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 3,
          },
          {
            class: "effect",
            type: "tap-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "rule-modification",
        mode: "allow",
        action: "attack-target",
        target: "additional-hero",
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({ hasKeyword: "crush" }),
      },
    },
  },
});
