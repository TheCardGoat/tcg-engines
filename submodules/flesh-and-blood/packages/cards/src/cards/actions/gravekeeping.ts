import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/gravekeeping.generated.ts";

export const gravekeeping = definePitchFamily(fabPitchFamilies["gravekeeping"], {
  abilities: () => ({
    banishGraveyard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["graveyard"],
              filter: {},
              count: 1,
            },
            outputBinding: "it",
          },
        },
      },
    },
  }),
});

export const {
  red: gravekeepingRed,
  yellow: gravekeepingYellow,
  blue: gravekeepingBlue,
} = gravekeeping.cards;
