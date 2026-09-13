import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mournful-casket.generated.ts";

export const mournfulCasket = defineCard(fabCardIdentitiesByCanonicalId["N7WdmmWqLrgc7hhzmpjbD"], {
  keywords: [temper],
  abilities: {
    ifAllyHasBeenPutIntoGraveyardTurnGets: {
      kind: "static",
      staticKind: "continuous",
      // Event window: zone-count + per:turn walks history.moves into GY this
      // turn (not current occupancy — an ally already sitting in GY from a
      // prior turn does not satisfy the printed "has been put into … this turn").
      // Ally is a subtype on the type line (FAB_SUBTYPES), not a type.
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
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        // Continuous while-condition (CR 5.4.7): re-evaluate while equipped
        // and the this-turn history gate holds — not a one-shot this-turn grant.
        duration: "permanent",
      },
    },
  },
});
