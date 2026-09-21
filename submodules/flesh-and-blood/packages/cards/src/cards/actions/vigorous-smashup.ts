import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vigorous-smashup.generated.ts";

export const vigorousSmashup = definePitchFamily(fabPitchFamilies["vigorous-smashup"], {
  abilities: () => ({
    triggeredStaticOnDefendEffect: {
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
                token: "vigor",
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
  red: vigorousSmashupRed,
  yellow: vigorousSmashupYellow,
  blue: vigorousSmashupBlue,
} = vigorousSmashup.cards;
