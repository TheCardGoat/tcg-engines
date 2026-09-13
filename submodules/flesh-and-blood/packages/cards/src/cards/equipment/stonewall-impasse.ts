import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/stonewall-impasse.generated.ts";

export const stonewallImpasse = defineCard(
  fabCardIdentitiesByCanonicalId["6CrKfkzFgFLWFD7tFgT9H"],
  {
    keywords: [temper],
    abilities: {
      whenDefendsClashAttackingHeroIfWinGets1: {
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
              },
              {
                type: "conditional",
                condition: {
                  type: "has-status",
                  status: "won-clash",
                },
                then: {
                  type: "modify-numeric",
                  property: "defense",
                  op: "add",
                  amount: 1,
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
              },
            ],
          },
        },
        label: {
          name: "clash",
        },
      },
    },
  },
);
