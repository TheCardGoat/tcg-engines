import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/unmake-the-underlings.generated.ts";
import { stealth } from "../shared/keywords.ts";

export const unmakeTheUnderlings = definePitchFamily(fabPitchFamilies["unmake-the-underlings"], {
  keywords: [stealth],
  abilities: () => ({
    whenAttacksHeroTurnAllyInTheirGraveyardFaceDown: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "turn-face-down",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["graveyard"],
            filter: {
              typeBox: {
                subtypes: ["Ally"],
              },
            },
            count: 1,
          },
        },
      },
    },
    whenHitsAllyDestroyAlly: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            bindAs: "it",
          },
          target: {
            kind: "object",
            filter: {
              typeBox: {
                subtypes: ["Ally"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: {
            selector: "attack-target",
          },
        },
      },
    },
  }),
});

export const { blue: unmakeTheUnderlingsBlue } = unmakeTheUnderlings.cards;
