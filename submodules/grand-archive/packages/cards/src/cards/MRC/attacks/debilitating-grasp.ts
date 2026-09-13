import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const debilitatingGrasp: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wbsmks4etk",
  slug: "debilitating-grasp",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wbsmks4etk:face:default",
      catalogId: "wbsmks4etk",
      name: "Debilitating Grasp",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "CURSE"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] On Champion Hit: Put Debilitating Grasp on the bottom of the hit champion’s lineage.\n\nInherited Effect: The first card you activate each turn costs 1 more to activate.",
      abilities: [
        {
          id: "wbsmks4etk-a1",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: Put Debilitating Grasp on the bottom of the hit champion’s lineage.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "inner-lineage",
              host: {
                kind: "event-recipient",
              },
              placement: {
                kind: "bottom",
              },
            },
          },
        },
        {
          id: "wbsmks4etk-a2",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect: The first card you activate each turn costs 1 more to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "player",
                player: "controller",
              },
              occurrence: {
                count: 1,
                window: "this-turn",
                actorScope: "same-player",
              },
              costKind: "reserve",
              costOperation: "add",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
        },
      ],
    },
  },
};

export default debilitatingGrasp;
