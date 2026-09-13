import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tongue-tied.generated.ts";

export const tongueTied = definePitchFamily(fabPitchFamilies["tongue-tied"], {
  abilities: () => ({
    whenHitsHeroTurnInTheirArsenalFaceUpBanishInstantFrom: {
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
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "turn-face-up",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                count: 1,
              },
            },
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                filter: {
                  typeBox: {
                    types: ["Instant"],
                  },
                },
                count: 1,
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: tongueTiedRed } = tongueTied.cards;
