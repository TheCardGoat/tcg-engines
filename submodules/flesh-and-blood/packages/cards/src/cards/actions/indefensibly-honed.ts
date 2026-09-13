import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/indefensibly-honed.generated.ts";

export const indefensiblyHoned = definePitchFamily(fabPitchFamilies["indefensibly-honed"], {
  keywords: [
    {
      name: "sharpen",
    },
    goAgain,
  ],
  abilities: () => ({
    sharpenTargetSword: {
      kind: "resolution",
      effect: {
        type: "sharpen",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["weapon", "permanent"],
          filter: {
            typeBox: {
              subtypes: ["Sword"],
            },
          },
          count: 1,
        },
        outputBinding: "it",
      },
    },
    ability3More1PowerCountersNextAttackTurnGetsDefended1MoreDeal1DamageDefendingGoAgain: {
      kind: "resolution",
      condition: {
        type: "has-counter",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        target: {
          selector: "binding",
          binding: "it",
        },
        comparison: {
          op: "gte",
          value: 3,
        },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "defended1MoreDeal1DamageDefending",
            text: "",
            trigger: {
              kind: "event",
              event: {
                name: "defend",
                // The defend event's actor is the defending player; the
                // rider's subject is the attack being defended, not the
                // defending card.
                actor: {
                  kind: "player",
                  player: "defending-hero",
                },
                observes: {
                  kind: "source",
                  selector: "defended-attack",
                },
                amount: {
                  op: "gte",
                  value: 1,
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "deal-damage",
                damageType: "generic",
                amount: 1,
                target: {
                  selector: "defending-hero",
                },
              },
            },
          },
        },
        // "Your next attack with it this turn gets …" latches onto the
        // sharpened sword's own swings; this-attack never resolves from an
        // action-phase card layer because no chain is open while the Action
        // resolves.
        target: {
          selector: "binding",
          binding: "it",
        },
        duration: "this-turn",
        appliesTo: {
          attacksOf: true,
          count: 1,
          next: {
            typeBox: {
              types: ["Weapon"],
            },
          },
          events: ["attack"],
        },
      },
    },
  }),
});

export const { blue: indefensiblyHonedBlue } = indefensiblyHoned.cards;
