import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mischievous-meeps.generated.ts";

export const mischievousMeeps = definePitchFamily(fabPitchFamilies["mischievous-meeps"], {
  keywords: [goAgain],
  abilities: () => ({
    hitsGainItemCost2LessOtherwiseDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "unless",
          effect: {
            type: "draw",
            count: 1,
            player: "controller",
          },
          escape: {
            type: "gain-control",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                and: [
                  {
                    typeBox: {
                      subtypes: ["Item"],
                    },
                  },
                  {
                    numeric: [
                      {
                        property: "cost",
                        basis: "base",
                        comparison: {
                          op: "lte",
                          value: 2,
                        },
                      },
                    ],
                  },
                ],
              },
              count: 1,
            },
            controller: "controller",
          },
        },
      },
    },
  }),
});

export const { red: mischievousMeepsRed } = mischievousMeeps.cards;
