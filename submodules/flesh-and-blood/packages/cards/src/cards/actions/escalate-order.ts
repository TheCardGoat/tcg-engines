import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/escalate-order.generated.ts";

export const escalateOrder = definePitchFamily(fabPitchFamilies["escalate-order"], {
  abilities: () => ({
    whenAttacksIfControlToughnessTokenCreate3More: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "control-object",
          filter: {
            name: "Toughness",
            typeBox: {
              metatypes: ["Token"],
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "toughness",
          controller: "controller",
          count: 3,
        },
      },
    },
  }),
});
export const { red: escalateOrderRed } = escalateOrder.cards;
