import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/flowstate-embodiment.generated.ts";

/**
 * Model notes (hand-authored): printed "create an Embodiment of Lightning or
 * Lightning Flow token" is a modal choose, not a synthetic slug
 * "embodiment-of-lightning-or-lightning-flow" (that never resolves).
 */
export const flowstateEmbodiment = definePitchFamily(fabPitchFamilies["flowstate-embodiment"], {
  abilities: () => ({
    wheneverPlayInstantChainLinkCreateEmbodimentLightningLightning: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
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
                types: ["Instant"],
              },
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "choose-and-create-token",
          options: ["embodiment-of-lightning", "lightning-flow"],
          chooser: "controller",
          controller: "controller",
        },
      },
    },
  }),
});
export const { red: flowstateEmbodimentRed } = flowstateEmbodiment.cards;
