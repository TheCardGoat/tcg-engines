import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cindering-foresight.generated.ts";

import { opt } from "../shared/keywords.ts";

export const cinderingForesight = definePitchFamily(fabPitchFamilies["cindering-foresight"], {
  parameters: pitchMap({ red: { optAmount: 3 }, yellow: { optAmount: 2 }, blue: { optAmount: 1 } }),
  keywords: pitchMap({ red: [opt(3)], yellow: [opt(2)], blue: [opt(1)] }),
  abilities: ({ optAmount: _optAmount }) => ({
    staticPlayHasStatusNotTurn: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "has-status",
        status: "not-your-turn",
      },
      playEffect: {
        role: "permission",
        fromZones: ["hand"],
        asType: "instant",
        optional: true,
      },
    },
    resolutionReplacementModifyNumericCount: {
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
          },
        },
      },
    },
  }),
});

export const {
  red: cinderingForesightRed,
  yellow: cinderingForesightYellow,
  blue: cinderingForesightBlue,
} = cinderingForesight.cards;
