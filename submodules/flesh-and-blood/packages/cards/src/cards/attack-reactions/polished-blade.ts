import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/polished-blade.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const polishedBlade = definePitchFamily(fabPitchFamilies["polished-blade"], {
  abilities: () => ({
    removeCountersAndChooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "sum",
          operands: [
            {
              type: "count",
              what: "counters-removed-for-cost",
            },
            1,
          ],
        },
      },
      modes: {
        gainGoAgain: {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
          },
        },
        additionalSwordAttack: {
          kind: "resolution",
          // CR 5.2.3c: selecting the mode is the only decision; the allowance
          // applies by itself.
          effect: {
            type: "modify-activation-limit",
            target: {
              selector: "binding",
              binding: "it",
            },
            operation: "additional",
            count: 1,
            duration: "this-turn",
          },
        },
        reduceNextSwordAttackCost: {
          kind: "resolution",
          effect: {
            type: "modify-activation-cost",
            op: "subtract",
            amount: 1,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Sword"],
                },
              },
            },
          },
        },
      },
      additionalCost: {
        class: "effect",
        type: "remove-counters",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        count: {
          type: "all",
        },
        min: 1,
        filter: {
          typeBox: {
            subtypes: ["Sword"],
          },
          hasStatus: "attacking",
        },
        zone: "combat-chain",
        outputBinding: "it",
      },
    }),
  }),
});

export const { red: polishedBladeRed } = polishedBlade.cards;
