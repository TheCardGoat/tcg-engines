import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rhongomiantGrovesSpire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "clS3E0HrZL",
  slug: "rhongomiant-groves-spire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "clS3E0HrZL:face:default",
      catalogId: "clS3E0HrZL",
      name: "Rhongomiant, Grove's Spire",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 2,
        durability: 3,
      },
      rulesText:
        "Spellshroud\n\n[Mordred Bonus] As long as an opponent has influence eight or more, Rhongomiant gets +4POWER. (A player’s influence is equal to the total amount of cards in their hand and memory.)\n\n[Mordred Bonus] Whenever a durability counter is removed from Rhongomiant, you may return a card from your memory to your hand.",
      abilities: [
        {
          id: "clS3E0HrZL-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Spellshroud",
          keyword: {
            name: "spellshroud",
          },
        },
        {
          id: "clS3E0HrZL-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Mordred Bonus] As long as an opponent has influence eight or more, Rhongomiant gets +4POWER. (A player’s influence is equal to the total amount of cards in their hand and memory.)",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Mordred",
              },
            },
          ],
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-property-compare",
                players: "each-opponent",
                quantifier: "any",
                property: "influence",
                operator: "gte",
                value: 8,
              },
              duration: {
                kind: "while-source-in-functional-zone",
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
                amount: 4,
              },
            },
          ],
        },
        {
          id: "clS3E0HrZL-a3",
          kind: "triggered",
          text: "[Mordred Bonus] Whenever a durability counter is removed from Rhongomiant, you may return a card from your memory to your hand.",
          trigger: {
            kind: "event",
            event: {
              name: "counter-removed",
              counter: "durability",
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
                name: "Mordred",
              },
            },
          ],
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "returned-card",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["memory"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "returned-card",
                },
                from: "memory",
                destination: {
                  zone: "hand",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default rhongomiantGrovesSpire;
