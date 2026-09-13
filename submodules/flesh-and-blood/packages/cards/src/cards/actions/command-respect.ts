import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/command-respect.generated.ts";

export const commandRespect = definePitchFamily(fabPitchFamilies["command-respect"], {
  abilities: () => ({
    onHitDestroyPower: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
        state: {
          type: "object-numeric-comparison",
          property: "power",
          left: "current",
          op: "gt",
          right: "base",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["arsenal"],
            filter: {},
            count: 1,
          },
        },
      },
    },
  }),
});
export const {
  red: commandRespectRed,
  yellow: commandRespectYellow,
  blue: commandRespectBlue,
} = commandRespect.cards;
