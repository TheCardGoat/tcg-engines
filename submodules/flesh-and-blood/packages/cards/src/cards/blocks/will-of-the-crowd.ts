import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/will-of-the-crowd.generated.ts";

export const willOfTheCrowd = definePitchFamily(fabPitchFamilies["will-of-the-crowd"], {
  abilities: () => ({
    boostDefendingActionsWhenCheered: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: { type: "performed-this-turn", event: "cheered", player: "controller" },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 3,
          target: {
            selector: "object",
            declared: "at-resolution",
            zones: ["combat-chain"],
            filter: {
              typeBox: { types: ["Action"] },
              defending: true,
            },
            count: {
              type: "all",
            },
          },
          duration: "this-chain-link",
        },
      },
    },
  }),
});

export const { blue: willOfTheCrowdBlue } = willOfTheCrowd.cards;
