import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/etchings-of-arcana.generated.ts";
export const etchingsOfArcana = definePitchFamily(fabPitchFamilies["etchings-of-arcana"], {
  parameters: pitchMap({ red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamageArcane: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "any-hero",
        },
      },
    },
    resolutionSourceDamageDealtOptionalMoveSurge: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: damage },
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["graveyard"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
              moniker: "Sigil",
            },
            count: 1,
          },
          to: {
            zone: "hand",
          },
        },
      },
      label: {
        name: "surge",
      },
    },
  }),
});
export const {
  red: etchingsOfArcanaRed,
  yellow: etchingsOfArcanaYellow,
  blue: etchingsOfArcanaBlue,
} = etchingsOfArcana.cards;
