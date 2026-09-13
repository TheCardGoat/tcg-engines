import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/hoist-em-up.generated.ts";

export const hoistEmUp = definePitchFamily(fabPitchFamilies["hoist-em-up"], {
  abilities: () => ({
    tapAllyForDefense: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "tap",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Ally"],
                },
              },
              count: 1,
            },
          },
          then: {
            type: "modify-numeric",
            property: "defense",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});

export const { red: hoistEmUpRed } = hoistEmUp.cards;
