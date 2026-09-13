import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/defang-the-dragon.generated.ts";

import { stealth } from "../shared/keywords.ts";

export const defangTheDragon = definePitchFamily(fabPitchFamilies["defang-the-dragon"], {
  keywords: [stealth],
  abilities: () => ({
    areContractedHitMarkedHeroNamedFang: {
      kind: "resolution",
      effect: {
        type: "contract-task",
        task: "hit a marked hero named Fang",
        completeOn: "hit",
        filter: { hasStatus: "marked", moniker: "Fang" },
      },
      label: {
        name: "contract",
      },
    },
    wheneverCompleteContractDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "complete-contract",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
      label: {
        name: "contract",
      },
    },
  }),
});
export const { red: defangTheDragonRed } = defangTheDragon.cards;
