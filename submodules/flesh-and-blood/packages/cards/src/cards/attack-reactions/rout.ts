import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/rout.generated.ts";

export const rout = definePitchFamily(fabPitchFamilies["rout"], {
  abilities: () => ({
    boostWeaponAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Weapon"],
            },
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
    returnDefendingCard: {
      kind: "resolution",
      condition: {
        type: "defended-this-chain-link",
        from: "hand",
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-card",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "any",
            zones: ["combat-chain"],
            filter: {
              defending: true,
              typeBox: {
                excludeTypes: ["Equipment"],
              },
            },
            count: 1,
          },
          to: {
            zone: "hand",
          },
        },
      },
      label: {
        name: "reprise",
      },
    },
  }),
});

export const { red: routRed } = rout.cards;
