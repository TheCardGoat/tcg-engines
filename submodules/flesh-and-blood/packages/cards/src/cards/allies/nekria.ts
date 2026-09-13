import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/allies/nekria.generated.ts";

export const nekria = defineCard(fabCardIdentitiesByCanonicalId.b886KqRJLbpj78kHWMQJ9, {
  abilities: {
    createAshAfterDealingDamage: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "damage-source",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "add-counter",
              counter: {
                kind: "numeric",
                value: -1,
                property: "life",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            {
              type: "create-token",
              token: "ash",
              controller: "controller",
            },
          ],
        },
      },
    },
    createAshAfterBeingDealtDamage: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "dealt-damage",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "damage-target",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "add-counter",
              counter: {
                kind: "numeric",
                value: -1,
                property: "life",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            {
              type: "create-token",
              token: "ash",
              controller: "controller",
            },
          ],
        },
      },
    },
  },
});
