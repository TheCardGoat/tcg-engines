import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/sigil-of-parapets.generated.ts";

export const sigilOfParapets = definePitchFamily(fabPitchFamilies["sigil-of-parapets"], {
  abilities: () => ({
    gainDefenseOnWizardPlay: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Wizard"],
              },
            },
            bindAs: "it",
          },
        },
        state: {
          type: "has-status",
          status: "defending",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "defense",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
      },
    },
  }),
});

export const { blue: sigilOfParapetsBlue } = sigilOfParapets.cards;
