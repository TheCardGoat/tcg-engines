import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/test-of-iron-grip.generated.ts";

export const testOfIronGrip = definePitchFamily(fabPitchFamilies["test-of-iron-grip"], {
  abilities: () => ({
    clashToDiscardCards: {
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
              // Canonical clash-prize slot: engine binds winner/loser here,
              // so "the other hero discards" is the loser-side discard.
              prize: {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "loser",
                  chooser: "loser",
                  zones: ["hand"],
                  count: 1,
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

export const { red: testOfIronGripRed } = testOfIronGrip.cards;
