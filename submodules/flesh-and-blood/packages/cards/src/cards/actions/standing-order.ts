import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/standing-order.generated.ts";

export const standingOrder = definePitchFamily(fabPitchFamilies["standing-order"], {
  abilities: () => ({
    whenAttacksDefendsPutFromArsenalOnBottomDeckDoGetsNumber2: {
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
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["arsenal"],
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 2,
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
              {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 2,
                target: {
                  selector: "self",
                },
                duration: "permanent",
              },
            ],
          },
        },
      },
    },
    whenAttacksDefendsPutFromArsenalOnBottomDeckDoGetsNumber2WhenAttacksDefendsPutFromArsenalOnBottomDeckDoGetsNumber2:
      {
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
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["arsenal"],
                count: 1,
              },
              to: {
                zone: "deck",
                position: "bottom",
              },
            },
            then: {
              type: "sequence",
              steps: [
                {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 2,
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
                {
                  type: "modify-numeric",
                  property: "defense",
                  op: "add",
                  amount: 2,
                  target: {
                    selector: "self",
                  },
                  duration: "permanent",
                },
              ],
            },
          },
        },
      },
  }),
});

export const { red: standingOrderRed } = standingOrder.cards;
