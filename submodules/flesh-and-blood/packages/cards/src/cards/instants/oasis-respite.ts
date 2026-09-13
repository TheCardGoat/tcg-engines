import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/oasis-respite.generated.ts";

export const oasisRespite = definePitchFamily(fabPitchFamilies["oasis-respite"], {
  parameters: pitchMap({
    red: { amount: 4 },
    yellow: { amount: 3 },
    blue: { amount: 2 },
  }),
  abilities: ({ amount }) => ({
    respite: {
      type: "sequence",
      steps: [
        {
          type: "prevention",
          preventionKind: "shielding",
          amount,
          shielded: { selector: "any-hero" },
          source: {
            selector: "object",
            declared: "on-stack",
            player: "any",
            zones: [
              "hero",
              "permanent",
              "weapon",
              "equipment-arms",
              "equipment-chest",
              "equipment-head",
              "equipment-legs",
              "combat-chain",
              "stack",
            ],
            count: 1,
          },
          duration: "this-turn",
        },
        {
          type: "conditional",
          condition: {
            type: "life-comparison",
            player: "self",
            vs: "each-other-hero",
            op: "lt",
          },
          then: {
            type: "optional",
            effect: {
              type: "gain-life",
              amount: 1,
              target: { selector: "controller" },
            },
          },
        },
      ],
    },
  }),
});

export const {
  red: oasisRespiteRed,
  yellow: oasisRespiteYellow,
  blue: oasisRespiteBlue,
} = oasisRespite.cards;
