import { arcaneBarrier, modular } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/adaptive-dissolver.generated.ts";

export const adaptiveDissolver = defineCard(
  fabCardIdentitiesByCanonicalId["8TPwpCdF6GRn7cQRRGjQJ"],
  {
    keywords: [modular, arcaneBarrier(1)],
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
