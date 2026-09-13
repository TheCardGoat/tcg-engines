import { spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/graven-gaslight.generated.ts";

export const gravenGaslight = defineCard(fabCardIdentitiesByCanonicalId["wkgMjwtjQk7NCGLFt9wDw"], {
  keywords: [spellvoid(1)],
  abilities: {
    instantDestroy2SilverControlEquipActivateOnlyWhile: {
      kind: "activated",
      abilityType: "instant",
      functionalZones: ["graveyard"],
      cost: {
        class: "effect",
        type: "destroy",
        count: 2,
        filter: {
          name: "Silver",
        },
      },
      effect: {
        type: "equip",
        target: {
          selector: "self",
        },
      },
    },
  },
});
