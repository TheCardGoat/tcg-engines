import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/summer-s-fall.generated.ts";

export const summerSFall = definePitchFamily(fabPitchFamilies["summer-s-fall"], {
  abilities: () => ({
    decompose: {
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
            type: "move-card",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              count: { type: "up-to", amount: 1 },
            },
            to: {
              zone: "deck",
              position: "bottom",
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
  red: summerSFallRed,
  yellow: summerSFallYellow,
  blue: summerSFallBlue,
} = summerSFall.cards;
