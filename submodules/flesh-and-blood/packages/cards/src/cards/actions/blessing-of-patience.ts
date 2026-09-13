import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-patience.generated.ts";

export const blessingOfPatience = definePitchFamily(fabPitchFamilies["blessing-of-patience"], {
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
              type: "gain-life",
              amount: amount,
              target: {
                selector: "any-hero",
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: blessingOfPatienceRed,
  yellow: blessingOfPatienceYellow,
  blue: blessingOfPatienceBlue,
} = blessingOfPatience.cards;
