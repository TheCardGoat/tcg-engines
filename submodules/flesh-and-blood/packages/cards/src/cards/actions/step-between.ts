import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/step-between.generated.ts";

export const stepBetween = definePitchFamily(fabPitchFamilies["step-between"], {
  abilities: () => ({
    whileAttackingOnStackOpponentsCanTPlayActivateInstants: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "attacking-or-on-the-stack",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "rule-modification",
            mode: "restrict",
            action: "play",
            filter: {
              typeBox: {
                types: ["Instant"],
              },
            },
            duration: "while-condition",
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "activate",
            filter: {
              typeBox: {
                types: ["Instant"],
              },
            },
            duration: "while-condition",
          },
        ],
      },
    },
    instantResourceTHeroGetsNumber1PowerPowerDamageCanTPrevented: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "tap-hero",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "rule-modification",
            mode: "restrict",
            action: "be-prevented",
            duration: "this-combat-chain",
          },
        ],
      },
    },
  }),
});

export const { red: stepBetweenRed } = stepBetween.cards;
