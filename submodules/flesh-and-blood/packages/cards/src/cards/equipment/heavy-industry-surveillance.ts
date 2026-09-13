import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/heavy-industry-surveillance.generated.ts";

export const heavyIndustrySurveillance = defineCard(
  fabCardIdentitiesByCanonicalId["HDgpj7cmFJwFWqdrHgngk"],
  {
    keywords: [temper],
    abilities: {
      whenDefendsMayBanishTopDeckIfSMechanologist: {
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
                type: "optional",
                effect: {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "controller",
                    zones: ["deck"],
                    position: "top",
                    count: 1,
                  },
                  outputBinding: "it",
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "binding-matches",
                  binding: "it",
                  filter: {
                    typeBox: {
                      supertypes: ["Mechanologist"],
                    },
                  },
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
      },
    },
  },
);
