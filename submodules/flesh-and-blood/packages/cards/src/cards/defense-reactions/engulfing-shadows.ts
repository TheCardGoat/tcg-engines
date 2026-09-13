import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/engulfing-shadows.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const engulfingShadows = definePitchFamily(fabPitchFamilies["engulfing-shadows"], {
  keywords: [bloodDebt],
  abilities: () => ({
    banishInsteadOfGraveyard: {
      kind: "static",
      staticKind: "continuous",
      functionalZones: [
        "hand",
        "deck",
        "arsenal",
        "pitch",
        "stack",
        "combat-chain",
        "permanent",
        "banished",
        "graveyard",
      ],
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "move-zone",
          to: "graveyard",
          subject: "self",
        },
        modification: {
          type: "banish",
          target: {
            selector: "self",
          },
        },
        duration: "permanent",
      },
    },
  }),
});

export const { yellow: engulfingShadowsYellow } = engulfingShadows.cards;
