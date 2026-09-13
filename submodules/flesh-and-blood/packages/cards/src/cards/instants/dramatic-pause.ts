import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/dramatic-pause.generated.ts";
import { suspense } from "../shared/keywords.ts";

export const dramaticPause = definePitchFamily(fabPitchFamilies["dramatic-pause"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [suspense],
  abilities: (amount) => ({
    reinforceDefender: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: { kind: "any" },
          observes: { kind: "source", selector: "moved-object" },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount,
          target: {
            selector: "object",
            declared: "on-stack",
            zones: ["combat-chain"],
            filter: { typeBox: { types: ["Action"] }, defending: true },
            count: 1,
          },
          duration: "this-chain-link",
          outputBinding: "it",
        },
      },
    },
  }),
});

export const {
  red: dramaticPauseRed,
  yellow: dramaticPauseYellow,
  blue: dramaticPauseBlue,
} = dramaticPause.cards;
