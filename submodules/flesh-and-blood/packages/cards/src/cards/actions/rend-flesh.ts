import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rend-flesh.generated.ts";

export const rendFlesh = definePitchFamily(fabPitchFamilies["rend-flesh"], {
  keywords: [goAgain],
  abilities: () => ({
    endTurnWheneverSwordHitsRemove1PowerCounterLose2Life: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  subtypes: ["Sword"],
                },
              },
              bindAs: "it",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "every",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "remove-counters",
              counter: {
                kind: "numeric",
                value: 1,
                property: "power",
              },
              count: 1,
              target: {
                selector: "binding",
                binding: "it",
              },
            },
            then: {
              type: "lose-life",
              amount: 2,
              target: {
                selector: "attack-target",
              },
            },
          },
        },
      },
    },
  }),
});

export const { blue: rendFleshBlue } = rendFlesh.cards;
