import { guardwell, spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/arcanite-fortress.generated.ts";

/** Live count of controlled equipment with Arcanite in the name. */
const arcaniteEquipmentCount = {
  type: "count",
  what: "cards-in-zone",
  zone: "permanent",
  player: "controller",
  filter: {
    and: [{ typeBox: { types: ["Equipment"] } }, { nameContains: "Arcanite" }],
  },
} as const;

export const arcaniteFortress = defineCard(
  fabCardIdentitiesByCanonicalId["876Q8WnHQCPctd89zd8tn"],
  {
    keywords: [
      // Printed Spellvoid X — amount is a live count, not type-"x" placeholder.
      spellvoid(arcaniteEquipmentCount),
      guardwell,
    ],
    abilities: {
      sIsEqualNumberEquipmentControlArcaniteTheirName: {
        kind: "static",
        staticKind: "property",
        property: "defense",
        value: arcaniteEquipmentCount,
      },
      spellvoidXWhereXIsNumberEquipmentControlArcanite: {
        kind: "static",
        staticKind: "continuous",
        // Continuous re-grant keeps the dynamic amount live (PEN030 sibling).
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: {
              name: "spellvoid",
              value: arcaniteEquipmentCount,
            },
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  },
);
