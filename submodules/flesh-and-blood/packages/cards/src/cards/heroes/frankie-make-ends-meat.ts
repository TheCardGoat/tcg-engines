import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/frankie-make-ends-meat.generated.ts";

export const frankieMakeEndsMeat = defineCard(
  fabCardIdentitiesByCanonicalId["qJdwq7GGjFb96CzLDqCdk"],
  {
    abilities: {
      wheneverEquipmentPutGraveyardInsteadBanish: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "move-zone",
            to: "graveyard",
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
            },
          },
          modification: {
            type: "banish",
            target: {
              selector: "binding",
              binding: "it",
            },
          },
          duration: "while-in-arena",
        },
      },
      actionResourceResourceResourceTapEquipEquipmentGraveyardGoAgain: {
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
          type: "equip",
          target: {
            selector: "object",
            // "Equip an equipment from a graveyard" — any player's GY.
            declared: "at-resolution",
            player: "any",
            zones: ["graveyard"],
            filter: {
              typeBox: {
                types: ["Equipment"],
              },
            },
            count: 1,
          },
        },
      },
    },
  },
);
