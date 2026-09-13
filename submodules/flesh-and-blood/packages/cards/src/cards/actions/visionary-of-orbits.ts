import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/visionary-of-orbits.generated.ts";

export const visionaryOfOrbits = definePitchFamily(fabPitchFamilies["visionary-of-orbits"], {
  abilities: () => ({
    whenHitsPutInstantFromGraveyardOnBottomDeck: {
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
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  types: ["Instant"],
                },
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
        },
      },
    },
  }),
});

export const { red: visionaryOfOrbitsRed } = visionaryOfOrbits.cards;
