import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/send-packing.generated.ts";

/**
 * Model notes (hand-authored): generated AST dropped the chain-link-resolve
 * return. Printed: banish arsenal on attack, then if this didn't hit, return
 * that card to its owner's hand.
 */
export const sendPacking = definePitchFamily(fabPitchFamilies["send-packing"], {
  abilities: () => ({
    whenAttacksHeroBanishFromTheirArsenalWhenChainLinkResolvesDidn: {
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
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "delayed-trigger",
              trigger: {
                kind: "event-and-state",
                event: {
                  name: "chain-link-resolve",
                  actor: {
                    kind: "any",
                  },
                  observes: {
                    kind: "source",
                    selector: "attack",
                  },
                },
                state: {
                  type: "has-status",
                  status: "didnt-hit",
                },
              },
              policy: {
                kind: "windowed",
                duration: "this-chain-link",
                matching: "first",
              },
              resolution: {
                kind: "effect",
                effect: {
                  type: "move-card",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                  to: {
                    zone: "hand",
                  },
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: sendPackingYellow } = sendPacking.cards;
