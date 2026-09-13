import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/thwart.generated.ts";

export const thwart = definePitchFamily(fabPitchFamilies.thwart, {
  abilities: () => ({
    removePowerCounters: {
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
          type: "remove-counters",
          counter: { kind: "numeric", value: 1, property: "power" },
          count: { type: "all" },
          target: { selector: "this-attack" },
        },
      },
    },
  }),
});
export const { yellow: thwartYellow } = thwart.cards;
