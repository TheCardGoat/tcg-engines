import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/whispers-within.generated.ts";

export const whispersWithin = definePitchFamily(fabPitchFamilies["whispers-within"], {
  abilities: () => ({
    whenDefendsOptOne: {
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
          type: "opt",
          count: 1,
        },
      },
    },
  }),
});

export const {
  red: whispersWithinRed,
  yellow: whispersWithinYellow,
  blue: whispersWithinBlue,
} = whispersWithin.cards;
