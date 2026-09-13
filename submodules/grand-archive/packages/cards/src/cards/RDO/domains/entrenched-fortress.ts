import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const entrenchedFortress: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PWkXI6rMl3",
  slug: "entrenched-fortress",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PWkXI6rMl3:face:default",
      catalogId: "PWkXI6rMl3",
      name: "Entrenched Fortress",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SIEGEABLE", "CASTLE"],
      },
      elements: ["TERA"],
      stats: {
        durability: 6,
      },
      rulesText:
        "Taunt (While awake, this domain must be targeted before other objects you control during your opponent’s attack declarations if able.)\n\nOn Enter: Deal 3 damage to target unit.",
      abilities: [
        {
          id: "PWkXI6rMl3-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Taunt (While awake, this domain must be targeted before other objects you control during your opponent’s attack declarations if able.)",
          keyword: {
            name: "taunt",
          },
        },
        {
          id: "PWkXI6rMl3-a2",
          kind: "triggered",
          text: "On Enter: Deal 3 damage to target unit.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
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
                kind: "exactly",
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
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default entrenchedFortress;
