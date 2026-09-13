import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/run-into-trouble.generated.ts";

export const runIntoTrouble = definePitchFamily(fabPitchFamilies["run-into-trouble"], {
  supertypeSets: [["Brute"], ["Warrior"]],
  abilities: () => ({
    agilityDamage: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
        },
        state: {
          type: "control-object",
          filter: { name: "Agility", typeBox: { metatypes: ["Token"] } },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "generic",
          amount: 1,
          target: { selector: "attacking-hero" },
        },
      },
    },
  }),
});

export const { red: runIntoTroubleRed } = runIntoTrouble.cards;
