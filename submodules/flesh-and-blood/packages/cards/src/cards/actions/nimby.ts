import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/nimby.generated.ts";

export const nimby = definePitchFamily(fabPitchFamilies["nimby"], {
  abilities: () => ({
    triggeredAttackOptionalSequenceSearchNimblismShuffle: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "search",
                zones: ["deck"],
                filter: {
                  name: "Nimblism",
                },
                mayFail: true,
                to: {
                  zone: "hand",
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
        },
      },
    },
  }),
});

export const { red: nimbyRed, yellow: nimbyYellow, blue: nimbyBlue } = nimby.cards;
