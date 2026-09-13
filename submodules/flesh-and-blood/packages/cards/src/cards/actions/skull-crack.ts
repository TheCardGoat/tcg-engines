import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/skull-crack.generated.ts";

export const skullCrack = definePitchFamily(fabPitchFamilies["skull-crack"], {
  abilities: () => ({
    whenSkullCrackDiscardedAtRandomGainResource: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "discard",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          random: true,
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-resources",
          amount: 1,
        },
      },
    },
  }),
});

export const { red: skullCrackRed } = skullCrack.cards;
