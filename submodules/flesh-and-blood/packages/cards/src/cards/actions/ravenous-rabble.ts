import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/ravenous-rabble.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const ravenousRabble = definePitchFamily(fabPitchFamilies["ravenous-rabble"], {
  keywords: [goAgain],
  abilities: () => ({
    triggeredAttackSequenceRevealModifyNumericPowerReferencePitchThisTurn: {
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
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "subtract",
              amount: {
                type: "reference",
                binding: "it",
                property: "pitch",
                missing: "zero",
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: ravenousRabbleRed,
  yellow: ravenousRabbleYellow,
  blue: ravenousRabbleBlue,
} = ravenousRabble.cards;
