import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tough-smashup.generated.ts";

export const toughSmashup = definePitchFamily(fabPitchFamilies["tough-smashup"], {
  abilities: () => ({
    createMightWhenDefending: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "clash",
              with: {
                selector: "attacking-hero",
              },
              prize: {
                type: "create-token",
                token: "toughness",
                creator: "token-controller",
                controller: "winner",
              },
            },
            {
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hero"],
                  filter: {
                    hasStatus: "revealed",
                  },
                  count: 1,
                },
                to: {
                  zone: "deck",
                  position: "bottom",
                },
              },
            },
          ],
        },
      },
      label: {
        name: "clash",
      },
    },
  }),
});
export const {
  red: toughSmashupRed,
  yellow: toughSmashupYellow,
  blue: toughSmashupBlue,
} = toughSmashup.cards;
