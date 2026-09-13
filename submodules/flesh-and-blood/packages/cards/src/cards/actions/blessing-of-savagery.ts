import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-savagery.generated.ts";

export const blessingOfSavagery = definePitchFamily(fabPitchFamilies["blessing-of-savagery"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (amount) => ({
    staticTriggeredStartPhaseStartPhaseSequence: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
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
                  power: {
                    op: "gte",
                    value: 6,
                  },
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: blessingOfSavageryRed,
  yellow: blessingOfSavageryYellow,
  blue: blessingOfSavageryBlue,
} = blessingOfSavagery.cards;
