import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/buzzsaw-trap.generated.ts";
import { legendary, specialization } from "../shared/keywords.ts";

export const buzzsawTrap = definePitchFamily(fabPitchFamilies["buzzsaw-trap"], {
  keywords: [legendary, specialization("Riptide")],
  abilities: () => ({
    restrictGainPowerOnBoostedAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
        state: {
          type: "object-numeric-comparison",
          target: { selector: "this-attack" },
          property: "power",
          left: "current",
          op: "gt",
          right: "base",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "rule-modification",
          mode: "restrict",
          action: "gain-power",
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasStatus: "attacking",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { blue: buzzsawTrapBlue } = buzzsawTrap.cards;
