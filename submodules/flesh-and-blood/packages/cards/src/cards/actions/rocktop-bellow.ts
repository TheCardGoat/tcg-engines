import { grantKeyword, plusPower } from "@tcg/flesh-and-blood-types";
import { goAgain, overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rocktop-bellow.generated.ts";

const nextAttack = { next: { typeBox: { subtypes: ["Attack"] as const } } };

export const rocktopBellow = definePitchFamily(fabPitchFamilies["rocktop-bellow"], {
  parameters: {
    red: { powerBonus: 4 },
    yellow: { powerBonus: 3 },
    blue: { powerBonus: 2 },
  },
  keywords: [goAgain],
  abilities: ({ powerBonus }) => ({
    revealThenBuffNextAttack: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                numeric: [
                  { property: "power", basis: "base", comparison: { op: "gte", value: 6 } },
                ],
              },
            },
            then: grantKeyword(overpower, { appliesTo: nextAttack }),
            else: {
              type: "move-card",
              target: { selector: "binding", binding: "it" },
              to: { zone: "deck", position: "bottom" },
            },
          },
          plusPower(powerBonus, { appliesTo: nextAttack }),
        ],
      },
    },
  }),
});

export const {
  red: rocktopBellowRed,
  yellow: rocktopBellowYellow,
  blue: rocktopBellowBlue,
} = rocktopBellow.cards;
