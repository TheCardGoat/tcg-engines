import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/check-raise.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const checkRaise = definePitchFamily(fabPitchFamilies["check-raise"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    nextWager: {
      type: "delayed-trigger",
      trigger: {
        kind: "event",
        event: {
          name: "wager",
          actor: { kind: "player", player: "ability-controller" },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: { kind: "any" },
            bindAs: "it",
          },
        },
      },
      policy: { kind: "windowed", duration: "this-turn", matching: "first" },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: { selector: "binding", binding: "it" },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const {
  red: checkRaiseRed,
  yellow: checkRaiseYellow,
  blue: checkRaiseBlue,
} = checkRaise.cards;
