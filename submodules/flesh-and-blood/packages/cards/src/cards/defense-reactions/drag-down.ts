import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/drag-down.generated.ts";

export const dragDown = definePitchFamily(fabPitchFamilies["drag-down"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    weakenAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: { kind: "player", player: "ability-controller" },
          observes: { kind: "source", selector: "defender" },
          bindDefendedAttackAs: "it",
          target: { kind: "any" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "subtract",
          amount,
          target: { selector: "binding", binding: "it" },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { red: dragDownRed, yellow: dragDownYellow, blue: dragDownBlue } = dragDown.cards;
