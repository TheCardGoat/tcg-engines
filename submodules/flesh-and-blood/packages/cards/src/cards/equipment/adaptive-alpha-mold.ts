import { battleworn, modular } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/adaptive-alpha-mold.generated.ts";

export const adaptiveAlphaMold = defineCard(
  fabCardIdentitiesByCanonicalId["Wmr8NmHdQCmPCbMBPncTq"],
  {
    keywords: [modular, battleworn],
    abilities: {
      action0EquipAnotherEquipmentZone: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "asset",
          type: "resources",
          amount: 0,
        },
        effect: {
          type: "equip",
          target: {
            selector: "self",
          },
        },
      },
    },
  },
);
