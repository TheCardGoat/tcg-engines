import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/cut-down-to-size.generated.ts";

export const cutDownToSize = definePitchFamily(fabPitchFamilies["cut-down-to-size"], {
  abilities: () => ({
    discardAtFour: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "hit",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "attack" },
          target: { kind: "hero" },
        },
        state: {
          type: "zone-count",
          zone: "hand",
          player: "attack-target",
          comparison: { op: "gte", value: 4 },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "discard",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "attack-target",
            zones: ["hand"],
            count: 1,
          },
        },
      },
    },
  }),
});

export const {
  red: cutDownToSizeRed,
  yellow: cutDownToSizeYellow,
  blue: cutDownToSizeBlue,
} = cutDownToSize.cards;
