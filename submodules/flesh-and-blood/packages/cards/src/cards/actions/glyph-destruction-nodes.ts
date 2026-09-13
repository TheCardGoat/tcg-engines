import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/glyph-destruction-nodes.generated.ts";

export const glyphDestructionNodes = definePitchFamily(
  fabPitchFamilies["glyph-destruction-nodes"],
  {
    abilities: () => ({
      deal3ArcaneDamageUpXTargetHeroesAllies: {
        kind: "resolution",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 3,
          target: {
            selector: "object",
            declared: "on-stack",
            upTo: true,
            zones: ["hero", "permanent"],
            filter: {
              or: [
                {
                  typeBox: {
                    types: ["Hero"],
                  },
                },
                {
                  typeBox: {
                    subtypes: ["Ally"],
                  },
                },
              ],
            },
            count: {
              type: "count",
              what: "cards-in-zone",
              zone: "permanent",
              player: "controller",
              filter: {
                and: [
                  {
                    typeBox: {
                      subtypes: ["Aura"],
                    },
                  },
                  {
                    nameContains: "Sigil",
                  },
                ],
              },
            },
          },
        },
      },
    }),
  },
);
export const { yellow: glyphDestructionNodesYellow } = glyphDestructionNodes.cards;
