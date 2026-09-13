import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/reckless-stampede.generated.ts";

export const recklessStampede = definePitchFamily(fabPitchFamilies["reckless-stampede"], {
  abilities: () => ({
    wheneverDefendsClashDefendingWinnerDeals1DamageOtherPutRevealedBottomOwnersDeck: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
          target: {
            kind: "any",
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
                selector: "defending-hero",
              },
              prize: {
                type: "deal-damage",
                damageType: "generic",
                amount: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["hero"],
                  count: {
                    type: "all",
                  },
                },
              },
            },
            {
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "each",
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

export const { red: recklessStampedeRed } = recklessStampede.cards;
