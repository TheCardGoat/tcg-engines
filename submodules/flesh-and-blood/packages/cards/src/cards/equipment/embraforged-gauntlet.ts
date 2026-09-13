import { bloodDebt, temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/embraforged-gauntlet.generated.ts";

export const embraforgedGauntlet = defineCard(
  fabCardIdentitiesByCanonicalId["8D9wTFwLWtN9hkFwDgRWW"],
  {
    keywords: [temper, bloodDebt],
    abilities: {
      ifWouldBePutIntoGraveyardFromAnywhereInstead: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "destroy",
            to: "graveyard",
            subject: "self",
          },
          modification: {
            type: "banish",
            target: {
              selector: "self",
            },
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
