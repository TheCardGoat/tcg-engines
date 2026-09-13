import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mark-of-the-beast.generated.ts";

export const markOfTheBeast = definePitchFamily(fabPitchFamilies["mark-of-the-beast"], {
  keywords: [bloodDebt],
  abilities: () => ({
    markBeastPutGraveyardAnywhereInsteadBanish: {
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

export const { yellow: markOfTheBeastYellow } = markOfTheBeast.cards;
