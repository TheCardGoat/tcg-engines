import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cog-in-the-machine.generated.ts";

export const cogInTheMachine = definePitchFamily(fabPitchFamilies["cog-in-the-machine"], {
  abilities: () => ({
    create2GoldenCogTokens: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "golden-cog",
        controller: "controller",
        count: 2,
      },
    },
    mayCogControlIfDoPutBottomOwnerS: {
      kind: "resolution",
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
                subtypes: ["Cog"],
              },
            },
            count: 1,
          },
        },
        then: {
          type: "move-card",
          target: {
            selector: "self",
          },
          to: {
            zone: "deck",
            position: "bottom",
          },
        },
      },
    },
  }),
});
export const { red: cogInTheMachineRed } = cogInTheMachine.cards;
