import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blossoming-decay.generated.ts";

export const blossomingDecay = definePitchFamily(fabPitchFamilies["blossoming-decay"], {
  abilities: () => ({
    staticTriggeredAttackAttackOptionalSequenceGainLifeDecompose: {
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
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["graveyard"],
                  filter: {
                    typeBox: {
                      supertypes: ["Earth"],
                    },
                  },
                  count: 2,
                },
              },
              {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["graveyard"],
                  filter: {
                    typeBox: {
                      types: ["Action"],
                    },
                  },
                  count: 1,
                },
              },
            ],
          },
          then: {
            type: "gain-life",
            amount: 1,
            target: {
              selector: "controller",
            },
          },
        },
      },
      label: {
        name: "decompose",
      },
    },
  }),
});

export const {
  red: blossomingDecayRed,
  yellow: blossomingDecayYellow,
  blue: blossomingDecayBlue,
} = blossomingDecay.cards;
