import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/verdant-tide.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const verdantTide = definePitchFamily(fabPitchFamilies["verdant-tide"], {
  keywords: [goAgain],
  abilities: () => ({
    untilEndTurnWouldCreateNumber1MoreElementalRunebladeAuraTokensInstead: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "create",
          creator: "controller",
          occurrences: "every",
          filter: {
            and: [
              {
                typeBox: {
                  metatypes: ["Token"],
                  subtypes: ["Aura"],
                },
              },
              {
                or: [
                  {
                    typeBox: {
                      supertypes: ["Elemental"],
                    },
                  },
                  {
                    typeBox: {
                      supertypes: ["Runeblade"],
                    },
                  },
                ],
              },
            ],
          },
        },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: 1,
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
        duration: "this-turn",
      },
    },
    earthWasPitchedPlayCreateEmbodimentEarthToken: {
      kind: "resolution",
      condition: {
        type: "binding-numeric",
        binding: "pitched-this-way-earth-card",
        comparison: { op: "eq", value: 1 },
      },
      effect: {
        type: "create-token",
        token: "embodiment-of-earth",
        controller: "controller",
      },
      label: {
        name: "earth-bond",
      },
    },
  }),
});

export const { red: verdantTideRed } = verdantTide.cards;
