import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/light-fingers.generated.ts";

export const lightFingers = defineCard(fabCardIdentitiesByCanonicalId["QCpd7ctKhtN7LCP8FqkmP"], {
  keywords: [bladeBreak],
  abilities: {
    whenDefendsIfAreThiefStealGoldTokenAttacking: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
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
        state: {
          type: "has-status",
          status: "hero-is-thief",
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-control",
          target: {
            selector: "object",
            // CR 6.6.6a: choose the Gold as the defend trigger is put on the
            // stack.
            declared: "on-stack",
            player: "attacking-hero",
            zones: ["permanent"],
            filter: {
              typeBox: {
                metatypes: ["Token"],
              },
              name: "Gold",
            },
            count: 1,
          },
          controller: "controller",
        },
      },
    },
  },
});
