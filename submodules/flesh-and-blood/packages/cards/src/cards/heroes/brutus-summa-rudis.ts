import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/brutus-summa-rudis.generated.ts";

export const brutusSummaRudis = defineCard(
  fabCardIdentitiesByCanonicalId["Dh8tPtFJwkqg8jbGTjNWQ"],
  {
    abilities: {
      clashAnyClassTalentDeck: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "rule-modification",
          mode: "allow",
          action: "have-in-deck",
          filter: {
            hasStatus: "deckbuilding-exception",
          },
          duration: "permanent",
        },
      },
      allClashFailWinInsteadChooseWhichWinsClash: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "replacement",
          replacementKind: "outcome",
          replaces: {
            name: "clash-outcome",
          },
          modification: {
            type: "win-clash",
          },
          duration: "permanent",
        },
      },
    },
  },
);
