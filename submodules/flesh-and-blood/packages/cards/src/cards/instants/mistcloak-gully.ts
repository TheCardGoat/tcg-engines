import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/instants/mistcloak-gully.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const mistcloakGully = defineCard(fabCardIdentitiesByCanonicalId.gJH8NpPRNdFtTbDQTDzHL, {
  keywords: [legendary],
  abilities: {
    firstAttackTargetingYouGetsMinusPower: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: -1,
        target: {
          selector: "this-attack",
        },
        duration: "while-in-arena",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
            hasStatus: "targeting-you",
          },
          events: ["attack"],
          ordinal: 1,
        },
      },
      label: {
        name: "transcend",
      },
    },
    destroyOrTranscendAtEndPhase: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "conditional",
              condition: {
                type: "not",
                condition: {
                  type: "or",
                  conditions: [
                    { type: "pitch-zone-has", filter: { color: ["blue"] } },
                    {
                      type: "played-this",
                      per: "turn",
                      filter: { color: ["blue"] },
                      comparison: { op: "gte", value: 1 },
                    },
                    {
                      type: "zone-count",
                      zone: "combat-chain",
                      player: "controller",
                      per: "turn",
                      filter: { color: ["blue"] },
                      comparison: { op: "gte", value: 1 },
                    },
                  ],
                },
              },
              then: {
                type: "destroy",
                target: {
                  selector: "self",
                },
              },
            },
            {
              type: "conditional",
              condition: {
                type: "and",
                conditions: [
                  { type: "pitch-zone-has", filter: { color: ["blue"] } },
                  {
                    type: "played-this",
                    per: "turn",
                    filter: { color: ["blue"] },
                    comparison: { op: "gte", value: 1 },
                  },
                  {
                    type: "zone-count",
                    zone: "combat-chain",
                    player: "controller",
                    per: "turn",
                    filter: { color: ["blue"] },
                    comparison: { op: "gte", value: 1 },
                  },
                ],
              },
              then: {
                type: "transcend",
                target: {
                  selector: "self",
                },
              },
            },
          ],
        },
      },
      label: {
        name: "transcend",
      },
    },
  },
});
