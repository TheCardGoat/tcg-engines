import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/singing-steelblade.generated.ts";

export const singingSteelblade = definePitchFamily(fabPitchFamilies["singing-steelblade"], {
  keywords: [
    {
      name: "specialization",
      hero: "Dorinthea",
    },
  ],
  abilities: () => ({
    boostWeaponAttack: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
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
    searchAttackReaction: {
      kind: "resolution",
      condition: {
        type: "defended-this-chain-link",
        from: "hand",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              typeBox: {
                types: ["Attack Reaction"],
              },
            },
            mayFail: true,
            to: {
              zone: "banished",
            },
            faceDown: false,
            outputBinding: "it",
          },
          {
            type: "shuffle",
            zone: "deck",
          },
          {
            type: "optional",
            effect: {
              type: "play-card",
              fromZones: ["banished"],
              source: {
                selector: "binding",
                binding: "it",
              },
              duration: "this-chain-link",
            },
          },
        ],
      },
      label: {
        name: "reprise",
      },
    },
  }),
});

export const { yellow: singingSteelbladeYellow } = singingSteelblade.cards;
