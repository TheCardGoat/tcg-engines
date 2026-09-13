import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tempest-aurora.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tempestAurora = definePitchFamily(fabPitchFamilies["tempest-aurora"], {
  keywords: [goAgain],
  parameters: pitchMap({ red: { costLimit: 2 }, yellow: { costLimit: 1 }, blue: { costLimit: 0 } }),
  abilities: ({ costLimit }) => ({
    resolutionReplacement: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "damage",
          damageType: "arcane",
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
        appliesTo: {
          next: {
            hasStatus: "arcane-damage-effect",
            cost: {
              op: "lte",
              value: costLimit,
            },
          },
        },
      },
    },
  }),
});

export const {
  red: tempestAuroraRed,
  yellow: tempestAuroraYellow,
  blue: tempestAuroraBlue,
} = tempestAurora.cards;
