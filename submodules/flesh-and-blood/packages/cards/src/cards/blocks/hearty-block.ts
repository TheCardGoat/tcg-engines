import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/hearty-block.generated.ts";

export const heartyBlock = definePitchFamily(fabPitchFamilies["hearty-block"], {
  supertypeSets: [["Guardian"], ["Warrior"]],
  abilities: () => ({
    vigorLife: {
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
          filter: { name: "Vigor", typeBox: { metatypes: ["Token"] } },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
      },
    },
  }),
});

export const { red: heartyBlockRed } = heartyBlock.cards;
