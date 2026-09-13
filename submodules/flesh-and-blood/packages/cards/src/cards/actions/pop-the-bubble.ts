import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pop-the-bubble.generated.ts";

export const popTheBubble = definePitchFamily(fabPitchFamilies["pop-the-bubble"], {
  parameters: { red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } },
  abilities: ({ damage }) => ({
    dealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
    sourceDamageDealtDestroySurge: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: 3 },
        toHero: true,
      },
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Aura"],
            },
          },
          count: 1,
        },
      },
      label: {
        name: "surge",
      },
    },
  }),
});

export const {
  red: popTheBubbleRed,
  yellow: popTheBubbleYellow,
  blue: popTheBubbleBlue,
} = popTheBubble.cards;
