import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-vynserakai.generated.ts";

export const blessingOfVynserakai = definePitchFamily(fabPitchFamilies["blessing-of-vynserakai"], {
  abilities: () => ({
    atStartTurnDestroyThenNextAttackTurnIs: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "grant-property",
                  property: {
                    kind: "supertype",
                    value: "Draconic",
                  },
                  target: {
                    selector: "this-attack",
                  },
                  duration: "this-turn",
                  appliesTo: {
                    next: {
                      typeBox: {
                        subtypes: ["Attack"],
                      },
                    },
                  },
                },
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 3,
                  target: {
                    selector: "this-attack",
                  },
                  duration: "this-turn",
                  appliesTo: {
                    next: {
                      typeBox: {
                        subtypes: ["Attack"],
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    },
  }),
});
export const { red: blessingOfVynserakaiRed } = blessingOfVynserakai.cards;
