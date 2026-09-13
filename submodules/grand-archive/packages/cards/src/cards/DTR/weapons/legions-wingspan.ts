import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const legionsWingspan: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iuixf9rdmu",
  slug: "legions-wingspan",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iuixf9rdmu:face:default",
      catalogId: "iuixf9rdmu",
      name: "Legion's Wingspan",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERWING"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "[Diana Bonus] On Attack: For each wind element card in the attacker's intent, choose an ally you control. That ally gets +1POWER until end of turn.",
      abilities: [
        {
          id: "iuixf9rdmu-a1",
          kind: "triggered",
          text: "[Diana Bonus] On Attack: For each wind element card in the attacker's intent, choose an ally you control. That ally gets +1POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diana",
              },
            },
          ],
          effect: {
            kind: "for-each",
            collection: {
              zones: ["intent"],
              host: {
                kind: "event-attacker",
              },
              relationship: "intent-of",
              filter: {
                kind: "element",
                oneOf: ["WIND"],
              },
            },
            bindEachAs: "wind-intent-card",
            effect: {
              kind: "choose",
              selection: {
                id: "chosen-ally",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                },
              },
              effect: {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "chosen-ally",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "E",
                  modifies: "stat",
                  sublayer: "modifier",
                },
                change: {
                  kind: "numeric",
                  property: "power",
                  operation: "add",
                  amount: 1,
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default legionsWingspan;
