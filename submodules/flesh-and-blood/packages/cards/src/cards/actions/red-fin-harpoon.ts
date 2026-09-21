import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/red-fin-harpoon.generated.ts";

export const redFinHarpoon = definePitchFamily(fabPitchFamilies["red-fin-harpoon"], {
  abilities: () => ({
    hitsChooseRevealHandRedDiscardCreateGoldTokenActivatedCannonTurnInsteadLookHandChoose: {
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
          type: "sequence",
          steps: [
            {
              type: "reveal",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hand"],
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  color: ["red"],
                },
              },
              then: {
                type: "sequence",
                steps: [
                  {
                    type: "discard",
                    target: {
                      selector: "binding",
                      binding: "it",
                    },
                  },
                  {
                    type: "create-token",
                    token: "gold",
                    controller: "controller",
                  },
                ],
              },
            },
            {
              type: "self-replacement",
              condition: {
                type: "performed-this-turn",
                event: "activate-cannon",
                player: "controller",
              },
              modification: {
                type: "look",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["hand"],
                  count: {
                    type: "all",
                  },
                },
                outputBinding: "it",
              },
            },
          ],
        },
      },
      label: {
        name: "go-fish",
      },
    },
  }),
});

export const { blue: redFinHarpoonBlue } = redFinHarpoon.cards;
