import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/act-of-glory.generated.ts";
import { suspense } from "../shared/keywords.ts";

export const actOfGlory = definePitchFamily(fabPitchFamilies["act-of-glory"], {
  parameters: pitchMap({ red: 6, yellow: 5, blue: 4 }),
  keywords: [suspense],
  abilities: (amount) => ({
    armNextAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "leave-arena",
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
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount,
          target: {
            selector: "this-attack",
          },
          duration: "this-turn",
          appliesTo: {
            next: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
          },
        },
      },
    },
  }),
});

export const {
  red: actOfGloryRed,
  yellow: actOfGloryYellow,
  blue: actOfGloryBlue,
} = actOfGlory.cards;
