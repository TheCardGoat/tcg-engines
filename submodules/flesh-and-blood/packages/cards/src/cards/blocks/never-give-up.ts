import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/never-give-up.generated.ts";

export const neverGiveUp = definePitchFamily(fabPitchFamilies["never-give-up"], {
  abilities: () => ({
    graveyardDefenseBoost: {
      kind: "activated",
      abilityType: "instant",
      functionalZones: ["graveyard"],
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "move-to-deck",
            from: "self",
            position: "bottom",
            count: 1,
          },
        ],
      },
      condition: {
        type: "and",
        conditions: [
          {
            type: "life-comparison",
            player: "self",
            vs: "each-hero",
            op: "lt",
          },
          { type: "performed-this-turn", event: "cheered", player: "controller" },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 3,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
            defending: true,
          },
          count: 1,
        },
        duration: "this-chain-link",
        outputBinding: "it",
      },
    },
  }),
});

export const { yellow: neverGiveUpYellow } = neverGiveUp.cards;
