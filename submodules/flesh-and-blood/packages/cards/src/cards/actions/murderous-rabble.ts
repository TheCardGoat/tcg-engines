import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/murderous-rabble.generated.ts";

export const murderousRabble = definePitchFamily(fabPitchFamilies["murderous-rabble"], {
  keywords: [goAgain],
  abilities: () => ({
    attacksRevealTopDeckGetsXPowerWhereXPitchValueRevealedWay: {
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
              op: "add",
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

export const { blue: murderousRabbleBlue } = murderousRabble.cards;
