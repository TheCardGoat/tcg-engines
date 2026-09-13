import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hit-the-high-notes.generated.ts";

export const hitTheHighNotes = definePitchFamily(fabPitchFamilies["hit-the-high-notes"], {
  abilities: () => ({
    performedThisTurnPlayOrCreateAuraModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-or-create-aura",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: hitTheHighNotesRed,
  yellow: hitTheHighNotesYellow,
  blue: hitTheHighNotesBlue,
} = hitTheHighNotes.cards;
