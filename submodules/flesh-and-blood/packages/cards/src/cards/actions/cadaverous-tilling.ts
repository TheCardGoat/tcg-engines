import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cadaverous-tilling.generated.ts";

export const cadaverousTilling = definePitchFamily(fabPitchFamilies["cadaverous-tilling"], {
  abilities: () => ({
    decomposeOnAttack: {
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
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "this-turn",
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
  red: cadaverousTillingRed,
  yellow: cadaverousTillingYellow,
  blue: cadaverousTillingBlue,
} = cadaverousTilling.cards;
