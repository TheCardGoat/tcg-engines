import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/on-the-horizon.generated.ts";

export const onTheHorizon = definePitchFamily(fabPitchFamilies["on-the-horizon"], {
  abilities: () => ({
    lookOnDefend: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "look",
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
      },
    },
  }),
});

export const {
  red: onTheHorizonRed,
  yellow: onTheHorizonYellow,
  blue: onTheHorizonBlue,
} = onTheHorizon.cards;
