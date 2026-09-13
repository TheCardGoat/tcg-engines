import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gore-belching.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

export const goreBelching = definePitchFamily(fabPitchFamilies["gore-belching"], {
  abilities: () => ({
    whenAttacksRevealFromTopDeckUntilRevealAttack: {
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
              type: "unless",
              effect: {
                type: "modify-numeric",
                property: "power",
                op: "subtract",
                amount: 7,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
              escape: {
                type: "if-you-do",
                effect: {
                  type: "reveal",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["deck"],
                    position: "top",
                    filter: attackActionFilter(),
                    count: {
                      type: "all",
                    },
                  },
                  outputBinding: "it",
                },
                then: {
                  type: "sequence",
                  steps: [
                    {
                      type: "banish",
                      target: {
                        selector: "binding",
                        binding: "it",
                      },
                    },
                    {
                      type: "modify-numeric",
                      property: "power",
                      op: "subtract",
                      amount: {
                        type: "reference",
                        binding: "it",
                        property: "power",
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
            {
              type: "shuffle",
              zone: "deck",
            },
          ],
        },
      },
    },
  }),
});
export const { red: goreBelchingRed } = goreBelching.cards;
