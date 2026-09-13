import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blessing-of-spirits.generated.ts";

import { ward } from "../shared/keywords.ts";

const abilities = (pitch: number) =>
  ({
    onStartPhaseDestroyCreateTokenSpectralShield: {
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
              token: "spectral-shield",
              controller: "controller",
              count: 4 - pitch,
            },
          ],
        },
      },
    },
  }) as const;

export const blessingOfSpirits = definePitchFamily(fabPitchFamilies["blessing-of-spirits"], {
  keywords: [ward(1)],
  abilities: (_parameter, { pitch }) => ({ ...abilities(Number(pitch)) }),
});

export const {
  red: blessingOfSpiritsRed,
  yellow: blessingOfSpiritsYellow,
  blue: blessingOfSpiritsBlue,
} = blessingOfSpirits.cards;
