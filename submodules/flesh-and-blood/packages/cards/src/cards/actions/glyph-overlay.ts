import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/glyph-overlay.generated.ts";
export const glyphOverlay = definePitchFamily(fabPitchFamilies["glyph-overlay"], {
  abilities: () => ({
    resolutionDealDamageArcane: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            and: [
              {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              {
                nameContains: "Sigil",
              },
            ],
          },
          plus: 3,
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero"],
          count: 1,
        },
      },
    },
    resolutionSourceDamageDealtSequenceSurge: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: 3 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-life",
            amount: 1,
            target: {
              selector: "controller",
            },
          },
          {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      subtypes: ["Aura"],
                    },
                    nameContains: "Sigil",
                  },
                  count: {
                    type: "all",
                  },
                },
                to: {
                  zone: "deck",
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
        ],
      },
      label: {
        name: "surge",
      },
    },
  }),
});
export const {
  red: glyphOverlayRed,
  yellow: glyphOverlayYellow,
  blue: glyphOverlayBlue,
} = glyphOverlay.cards;
