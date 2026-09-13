import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/spirit-of-eirina.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const spiritOfEirina = definePitchFamily(fabPitchFamilies["spirit-of-eirina"], {
  keywords: [legendary],
  abilities: () => ({
    spiritEirinaWouldPutIntoSoulInsteadPutIntoArena: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "move-zone",
          to: "soul",
          subject: "self",
        },
        modification: {
          type: "move-card",
          target: {
            selector: "binding",
            binding: "it",
          },
          to: {
            zone: "permanent",
          },
        },
        duration: "permanent",
      },
    },
    playLuminaAscensionAsThoughWereInstant: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "play-card",
        fromZones: ["hand", "arsenal"],
        source: {
          selector: "self",
        },
        appliesTo: {
          next: {
            name: "Lumina Ascension",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
        asType: "instant",
      },
    },
  }),
});

export const { yellow: spiritOfEirinaYellow } = spiritOfEirina.cards;
