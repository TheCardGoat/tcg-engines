import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/unwinding-finality.generated.ts";
import { fragment } from "../shared/keywords.ts";

export const unwindingFinality = definePitchFamily(fabPitchFamilies["unwinding-finality"], {
  keywords: [fragment],
  abilities: () => ({
    whenHitsDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
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
    },
    wheneverFragmentsPutLightningInstantFromGraveyardOnTopDeck: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "fragment",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                and: [
                  {
                    typeBox: {
                      supertypes: ["Lightning"],
                    },
                  },
                  {
                    typeBox: {
                      types: ["Instant"],
                    },
                  },
                ],
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "top",
            },
          },
        },
      },
    },
  }),
});

export const { red: unwindingFinalityRed } = unwindingFinality.cards;
