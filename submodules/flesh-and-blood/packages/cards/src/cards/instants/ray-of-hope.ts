import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/ray-of-hope.generated.ts";

export const rayOfHope = definePitchFamily(fabPitchFamilies["ray-of-hope"], {
  abilities: () => ({
    attacksControlHave1WhileAttackingShadowHeroTurn: {
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
              subtypes: ["Attack"],
            },
            hasStatus: "attacking-shadow-hero",
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
      },
    },
    ifHaveLessThanOpposingShadowHeroPutRay: {
      kind: "resolution",
      condition: {
        type: "and",
        conditions: [
          { type: "life-comparison", player: "self", vs: "opponent", op: "lt" },
          {
            type: "control-object",
            player: "opponent",
            zones: ["hero"],
            filter: { typeBox: { supertypes: ["Shadow"] } },
          },
        ],
      },
      effect: {
        type: "move-card",
        target: {
          selector: "self",
        },
        to: {
          zone: "soul",
        },
      },
    },
  }),
});

export const { yellow: rayOfHopeYellow } = rayOfHope.cards;
