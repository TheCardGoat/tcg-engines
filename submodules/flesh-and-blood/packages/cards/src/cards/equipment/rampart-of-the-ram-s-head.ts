import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/rampart-of-the-ram-s-head.generated.ts";

export const rampartOfTheRamSHead = defineCard(
  fabCardIdentitiesByCanonicalId["dfzBMM9Tm8Q8jRWdQKp97"],
  {
    abilities: {
      wheneverDefendRampartRamSHeadMayPayIf: {
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
              type: "pay",
              cost: {
                class: "asset",
                type: "resources",
                amount: 1,
              },
              payer: "controller",
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
    },
  },
);
