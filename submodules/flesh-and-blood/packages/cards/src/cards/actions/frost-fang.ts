import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/frost-fang.generated.ts";
export const frostFang = definePitchFamily(fabPitchFamilies["frost-fang"], {
  abilities: () => ({
    staticTriggeredHitUnlessDiscard: {
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
          type: "unless",
          effect: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["hand"],
              count: 1,
            },
          },
          escape: {
            type: "pay",
            cost: {
              class: "asset",
              type: "resources",
              amount: 2,
            },
            payer: "opponent",
          },
        },
      },
    },
  }),
});
export const { red: frostFangRed, yellow: frostFangYellow, blue: frostFangBlue } = frostFang.cards;
