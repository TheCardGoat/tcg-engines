import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/ouvia.generated.ts";

export const ouvia = defineCard(fabCardIdentitiesByCanonicalId.dR8hjTth9bHpdLfTBPLNM, {
  abilities: {
    transformAshAtStartOfTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "transform",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              name: "Ash",
            },
            count: {
              type: "up-to",
              amount: 1,
            },
          },
          into: "aether-ashwing",
        },
      },
      label: {
        name: "transform",
      },
    },
    transformAshOnEnteringArena: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "transform",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              name: "Ash",
            },
            count: {
              type: "up-to",
              amount: 1,
            },
          },
          into: "aether-ashwing",
        },
      },
      label: {
        name: "transform",
      },
    },
  },
});
