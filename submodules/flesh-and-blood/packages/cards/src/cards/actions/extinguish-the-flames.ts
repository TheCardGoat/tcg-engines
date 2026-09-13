import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/extinguish-the-flames.generated.ts";

import { stealth } from "../shared/keywords.ts";

export const extinguishTheFlames = definePitchFamily(fabPitchFamilies["extinguish-the-flames"], {
  keywords: [stealth],
  abilities: () => ({
    areContractedHitMarkedHeroNamedCindra: {
      kind: "resolution",
      effect: {
        type: "contract-task",
        task: "hit a marked hero named Cindra",
        completeOn: "hit",
        filter: { hasStatus: "marked", moniker: "Cindra" },
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
export const { red: extinguishTheFlamesRed } = extinguishTheFlames.cards;
