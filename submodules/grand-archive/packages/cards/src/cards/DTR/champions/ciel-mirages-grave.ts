import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cielMiragesGrave: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zhh43i1eaa",
  slug: "ciel-mirages-grave",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zhh43i1eaa:face:default",
      catalogId: "zhh43i1eaa",
      name: "Ciel, Mirage's Grave",
      lineageName: "Ciel",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        level: 3,
        life: 30,
      },
      rulesText:
        "Ciel Lineage\n\nWhenever an omen counter is put on a card in your banishment, as a Spell, deal 2 unpreventable damage to up to one target unit.",
      abilities: [
        {
          id: "zhh43i1eaa-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ciel Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Ciel",
          },
        },
        {
          id: "zhh43i1eaa-a2",
          kind: "triggered",
          text: "Whenever an omen counter is put on a card in your banishment, as a Spell, deal 2 unpreventable damage to up to one target unit.",
          trigger: {
            kind: "event",
            event: {
              name: "counter-added",
              actor: "controller",
              counter: "omen",
              subject: {
                kind: "event-object",
                owner: "controller",
                filter: {
                  kind: "zone",
                  oneOf: ["banishment"],
                },
              },
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 2,
              preventable: false,
            },
          },
        },
      ],
    },
  },
};

export default cielMiragesGrave;
