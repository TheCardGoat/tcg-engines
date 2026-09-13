import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/drawn-to-the-dark-dimension.generated.ts";

export const drawnToTheDarkDimension = definePitchFamily(
  fabPitchFamilies["drawn-to-the-dark-dimension"],
  {
    parameters: pitchMap({
      red: { duration: "while-in-arena", attackTriggered: true },
      yellow: { duration: "permanent", attackTriggered: false },
      blue: { duration: "permanent", attackTriggered: false },
    }),
    abilities: ({ duration, attackTriggered }) => ({
      costReduction: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "modify-numeric",
          property: "cost",
          op: "subtract",
          amount: {
            type: "count",
            what: "cards-in-zone",
            zone: "permanent",
            player: "controller",
            filter: { name: "Runechant" },
          },
          target: { selector: "self" },
          duration,
        },
      },
      draw: attackTriggered
        ? {
            kind: "static",
            staticKind: "triggered",
            trigger: {
              kind: "event",
              event: {
                name: "attack",
                actor: { kind: "player", player: "ability-controller" },
                observes: { kind: "source", selector: "attack" },
              },
            },
            resolution: {
              kind: "effect",
              effect: { type: "draw", count: 1, player: "controller" },
            },
          }
        : {
            kind: "resolution",
            effect: { type: "draw", count: 1, player: "controller" },
          },
    }),
  },
);

export const {
  red: drawnToTheDarkDimensionRed,
  yellow: drawnToTheDarkDimensionYellow,
  blue: drawnToTheDarkDimensionBlue,
} = drawnToTheDarkDimension.cards;
