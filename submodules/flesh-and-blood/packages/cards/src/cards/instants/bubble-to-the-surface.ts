import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/bubble-to-the-surface.generated.ts";

export const bubbleToTheSurface = definePitchFamily(fabPitchFamilies["bubble-to-the-surface"], {
  abilities: () => ({
    costsLessPlayEachDraconicChainLinkControl: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
    revealFromTopDeckUntilVeRevealedRedBanish: {
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
              filter: {
                color: ["red"],
              },
              count: {
                type: "all",
              },
            },
            outputBinding: "it",
          },
          {
            type: "banish",
            target: {
              selector: "binding",
              binding: "it",
            },
          },
          {
            type: "optional",
            effect: {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});

export const { red: bubbleToTheSurfaceRed } = bubbleToTheSurface.cards;
