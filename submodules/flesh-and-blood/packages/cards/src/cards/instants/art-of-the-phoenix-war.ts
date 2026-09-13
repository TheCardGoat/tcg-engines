import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/art-of-the-phoenix-war.generated.ts";

export const artOfThePhoenixWar = definePitchFamily(fabPitchFamilies["art-of-the-phoenix-war"], {
  abilities: () => ({
    asAdditionalCostPlayDiscardPhoenixFlame: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "effect",
          type: "discard",
          count: 1,
          filter: {
            name: "Phoenix Flame",
          },
        },
      },
    },
    draconicAttackActionControlGet1Turn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              supertypes: ["Draconic"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
    draw2: {
      kind: "resolution",
      effect: {
        type: "draw",
        count: 2,
        player: "controller",
      },
    },
  }),
});

export const { red: artOfThePhoenixWarRed } = artOfThePhoenixWar.cards;
