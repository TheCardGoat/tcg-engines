import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/art-of-the-dragon-blood.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const artOfTheDragonBlood = definePitchFamily(fabPitchFamilies["art-of-the-dragon-blood"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttacksIfIsDraconicGetsGoAgainNext: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "binding-matches",
          binding: "it",
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "grant-property",
              property: {
                kind: "keyword",
                keyword: goAgain,
              },
              target: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-turn",
            },
            {
              type: "modify-numeric",
              property: "cost",
              op: "subtract",
              amount: 1,
              target: {
                selector: "this-attack",
              },
              duration: "this-turn",
              appliesTo: {
                next: {
                  typeBox: {
                    supertypes: ["Draconic"],
                  },
                },
                count: 3,
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: artOfTheDragonBloodRed } = artOfTheDragonBlood.cards;
