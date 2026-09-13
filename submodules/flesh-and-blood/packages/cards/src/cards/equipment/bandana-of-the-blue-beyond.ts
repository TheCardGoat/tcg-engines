import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bandana-of-the-blue-beyond.generated.ts";

export const bandanaOfTheBlueBeyond = defineCard(
  fabCardIdentitiesByCanonicalId["rFtnRCDzmJrrJwfJfWnFC"],
  {
    abilities: {
      actionDiscardDestroyPutBlueFromGraveyardBottomDeck: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "effect",
              type: "discard",
              count: 1,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        layerKeywords: [goAgain],
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["graveyard"],
            // Printed "a blue card" — color, not types:["Blue"] residue.
            filter: {
              color: ["blue"],
            },
            count: 1,
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
      },
    },
  },
);
