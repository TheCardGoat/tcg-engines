import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/unworldly-bellow.generated.ts";
import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { goAgain } from "../shared/keywords.ts";

export const unworldlyBellow = definePitchFamily(fabPitchFamilies["unworldly-bellow"], {
  parameters: pitchMap({
    red: { powerBonus: 4 },
    yellow: { powerBonus: 3 },
    blue: { powerBonus: 2 },
  }),
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    playStaticEffect: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "banish",
          from: "graveyard",
          count: 3,
          random: true,
        },
      },
    },
    resolutionModifyNumeric: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: powerBonus,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: nextAttackActionLatch({
          or: [
            {
              typeBox: {
                supertypes: ["Brute"],
              },
            },
            {
              typeBox: {
                supertypes: ["Shadow"],
              },
            },
          ],
        }),
      },
    },
  }),
});

export const {
  red: unworldlyBellowRed,
  yellow: unworldlyBellowYellow,
  blue: unworldlyBellowBlue,
} = unworldlyBellow.cards;
