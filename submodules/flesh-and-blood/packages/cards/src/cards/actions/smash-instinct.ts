import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smash-instinct.generated.ts";

export const smashInstinct = definePitchFamily(fabPitchFamilies["smash-instinct"], {
  abilities: () => ({
    intimidate: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "intimidate",
          target: "opponent",
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const {
  red: smashInstinctRed,
  yellow: smashInstinctYellow,
  blue: smashInstinctBlue,
} = smashInstinct.cards;
