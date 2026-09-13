import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/a-good-clean-fight.generated.ts";

export const aGoodCleanFight = definePitchFamily(fabPitchFamilies["a-good-clean-fight"], {
  abilities: () => ({
    ifIsAttackingHeroNonEquipmentTheyOwnLose: {
      kind: "resolution",
      effect: {
        type: "conditional",
        condition: {
          type: "has-status",
          status: "attacking-a-hero",
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "remove-property",
              property: {
                kind: "abilities",
              },
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["permanent", "combat-chain", "stack"],
                filter: {
                  typeBox: {
                    excludeTypes: ["Equipment"],
                  },
                },
                count: {
                  type: "all",
                },
              },
              duration: "this-turn",
            },
            {
              type: "rule-modification",
              mode: "restrict",
              action: "gain-abilities",
              duration: "this-turn",
              subject: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["permanent", "combat-chain", "stack"],
                filter: {
                  typeBox: {
                    excludeTypes: ["Equipment"],
                  },
                },
                count: {
                  type: "all",
                },
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: aGoodCleanFightRed } = aGoodCleanFight.cards;
