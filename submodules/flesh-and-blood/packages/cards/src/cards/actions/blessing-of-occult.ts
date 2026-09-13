import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-occult.generated.ts";

export const blessingOfOccult = definePitchFamily(fabPitchFamilies["blessing-of-occult"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  abilities: (count) => ({
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
              type: "create-token",
              token: "runechant",
              controller: "controller",
              count,
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: blessingOfOccultRed,
  yellow: blessingOfOccultYellow,
  blue: blessingOfOccultBlue,
} = blessingOfOccult.cards;
