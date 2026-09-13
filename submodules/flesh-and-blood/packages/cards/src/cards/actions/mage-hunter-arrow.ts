import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mage-hunter-arrow.generated.ts";

export const mageHunterArrow = definePitchFamily(fabPitchFamilies["mage-hunter-arrow"], {
  abilities: () => ({
    instantDestroyNextTimeDealtArcaneDamageTurnPrevent3DamageActivateOnlyFaceUpArsenal: {
      kind: "activated",
      abilityType: "instant",
      functionalZones: ["arsenal"],
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "has-status",
        status: "face-up-in-arsenal",
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 3,
        times: 1,
        damageType: "arcane",
        shielded: {
          selector: "controller",
        },
        duration: "this-turn",
      },
    },
    hitsRunebladeWizardDestroyAura: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              or: [
                { typeBox: { supertypes: ["Runeblade"] } },
                { typeBox: { supertypes: ["Wizard"] } },
              ],
            },
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
          },
        },
      },
    },
  }),
});

export const { red: mageHunterArrowRed } = mageHunterArrow.cards;
