import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/unified-decree.generated.ts";

export const unifiedDecree = definePitchFamily(fabPitchFamilies["unified-decree"], {
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
    playTopAttackReaction: {
      kind: "resolution",
      condition: {
        type: "defended-this-chain-link",
        from: "hand",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                typeBox: {
                  // "Attack Reaction" is a TYPE (CR 1.3.2c), never a subtype —
                  // subtypes:["Reaction"] can never match (ARC119 golden;
                  // FIX-5, plan §5).
                  types: ["Attack Reaction"],
                },
              },
            },
            then: {
              type: "optional",
              effect: {
                type: "banish",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
              then: {
                type: "optional",
                effect: {
                  type: "play-card",
                  fromZones: ["banished"],
                  source: {
                    selector: "binding",
                    binding: "it",
                  },
                  duration: "this-combat-chain",
                },
              },
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

export const { yellow: unifiedDecreeYellow } = unifiedDecree.cards;
