import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nerves-of-steel.generated.ts";

export const nervesOfSteel = definePitchFamily(fabPitchFamilies["nerves-of-steel"], {
  abilities: () => ({
    nervesSteelEntersArenaRemove1DefenseCounterChestEquipment: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "remove-counters",
          counter: {
            kind: "numeric",
            value: -1,
            property: "defense",
          },
          count: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                types: ["Equipment"],
                subtypes: ["Chest"],
              },
            },
            count: 1,
          },
        },
      },
    },
    battlewornTemperEquipmentDoesntTriggerDefendsAttack2LessPower: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "rule-modification",
        mode: "restrict",
        action: "trigger",
        filter: {
          hasKeyword: "battleworn",
          hasStatus: "defends-attack-with-2-or-less-power",
        },
        duration: "while-in-arena",
      },
    },
    dealtDamageDestroyNervesSteel: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { blue: nervesOfSteelBlue } = nervesOfSteel.cards;
