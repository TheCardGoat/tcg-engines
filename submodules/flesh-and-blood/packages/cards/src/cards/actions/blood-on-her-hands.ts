import { semanticModalAbility } from "../../authoring/card.ts";
import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/blood-on-her-hands.generated.ts";

/** Model notes (hand-authored): Errata #9 modes target a 1H weapon; its attacks get +1{p}/go again, or it may attack twice. */
export const bloodOnHerHands = definePitchFamily(fabPitchFamilies["blood-on-her-hands"], {
  keywords: [
    {
      name: "specialization",
      hero: "Kassai",
    },
    goAgain,
  ],
  abilities: () => ({
    asAdditionalCostPlayBloodHerHandsDestroyAny: semanticModalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "count",
          what: "destroyed-this-way",
        },
        allowRepeat: true,
      },
      modes: {
        target1hWeaponSAttacksGet1Turn: {
          kind: "resolution",
          effect: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  subtypes: ["1H"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
          },
        },
        target1hWeaponSAttacksGetGoAgainTurn: {
          kind: "resolution",
          effect: {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  subtypes: ["1H"],
                },
              },
              count: 1,
            },
            duration: "this-turn",
            appliesTo: {
              attacksOf: true,
              next: {
                typeBox: {
                  types: ["Weapon"],
                  subtypes: ["1H"],
                },
              },
              count: { type: "all" },
              events: ["attack"],
            },
          },
        },
        target1hWeaponMayAttackTwiceTurn: {
          kind: "resolution",
          effect: {
            type: "modify-activation-limit",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  subtypes: ["1H"],
                },
              },
              count: 1,
            },
            operation: "set-total",
            count: 2,
            duration: "this-turn",
          },
        },
      },
      additionalCost: {
        class: "effect",
        type: "destroy",
        filter: {
          name: "Copper",
          typeBox: {
            metatypes: ["Token"],
          },
        },
        count: {
          type: "all",
        },
      },
    }),
  }),
});
export const { yellow: bloodOnHerHandsYellow } = bloodOnHerHands.cards;
