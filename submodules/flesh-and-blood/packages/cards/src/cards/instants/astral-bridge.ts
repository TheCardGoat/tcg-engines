import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/astral-bridge.generated.ts";

export const astralBridge = definePitchFamily(fabPitchFamilies["astral-bridge"], {
  abilities: () => ({
    putTopDeckIntoGraveyardIfSInstantMay: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            to: {
              zone: "graveyard",
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                typeBox: {
                  types: ["Instant"],
                },
              },
            },
            then: {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["graveyard"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            },
          },
        ],
      },
    },
    ifInstantHasBeenPutIntoGraveyardTurnDeal: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "graveyard",
        player: "controller",
        filter: {
          typeBox: {
            types: ["Instant"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
        per: "turn",
      },
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "any-hero",
        },
      },
      label: {
        name: "starfall",
      },
    },
  }),
});

export const { red: astralBridgeRed } = astralBridge.cards;
