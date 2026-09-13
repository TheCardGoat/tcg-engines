import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dabble-in-darkness.generated.ts";

import { bloodDebt } from "../shared/keywords.ts";

export const dabbleInDarkness = definePitchFamily(fabPitchFamilies["dabble-in-darkness"], {
  keywords: [bloodDebt],
  abilities: () => ({
    whenAttacksBanishTopDeckGetsXWhereX: {
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
              type: "banish",
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
export const { red: dabbleInDarknessRed } = dabbleInDarkness.cards;
