import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/war-cry-of-bellona.generated.ts";

export const warCryOfBellona = definePitchFamily(fabPitchFamilies["war-cry-of-bellona"], {
  abilities: () => ({
    boostRaydn: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            name: "Raydn",
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
    reflectWeaponDamageFromSoul: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "effect",
            type: "discard-self",
          },
          {
            class: "effect",
            type: "banish",
            from: "soul",
            count: {
              type: "x",
            },
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-card",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "any",
              zones: ["weapon"],
              filter: {
                typeBox: {
                  types: ["Weapon"],
                },
              },
              count: 1,
            },
            outputBinding: "target-weapon",
          },
          {
            type: "delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "deal-damage",
                actor: {
                  kind: "any",
                },
                observes: {
                  kind: "bound-object",
                  selector: "damage-source",
                  binding: "target-weapon",
                },
                target: {
                  kind: "hero",
                  player: "ability-controller",
                },
                amount: {
                  op: "lte",
                  value: {
                    type: "x",
                  },
                },
              },
            },
            policy: {
              kind: "windowed",
              duration: "this-turn",
              matching: "first",
            },
            resolution: {
              kind: "effect",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "rule-modification",
                    mode: "restrict",
                    action: "be-prevented",
                    subject: {
                      selector: "self",
                    },
                    duration: "this-turn",
                  },
                  {
                    type: "deal-damage",
                    damageType: "generic",
                    amount: {
                      type: "event-amount",
                    },
                    target: {
                      selector: "hero",
                      who: "target-controller",
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: warCryOfBellonaYellow } = warCryOfBellona.cards;
