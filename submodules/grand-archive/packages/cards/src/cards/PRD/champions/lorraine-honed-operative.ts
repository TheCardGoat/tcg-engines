import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lorraineHonedOperative: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UsX7t4lXfX",
  slug: "lorraine-honed-operative",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UsX7t4lXfX:face:default",
      catalogId: "UsX7t4lXfX",
      name: "Lorraine, Honed Operative",
      lineageName: "Lorraine",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 24,
      },
      rulesText:
        "Lorraine Lineage\n\nOn Enter: Banish up to three cards at random from your memory. For each card banished this way, draw a card into your memory. If that card is advanced element, put a durability counter on a Sword weapon you control and it gets +1POWER until end of turn.",
      abilities: [
        {
          id: "UsX7t4lXfX-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Lorraine Lineage",
          keyword: {
            name: "lineage",
            lineageName: "Lorraine",
          },
        },
        {
          id: "UsX7t4lXfX-a2",
          kind: "triggered",
          text: "On Enter: Banish up to three cards at random from your memory. For each card banished this way, draw a card into your memory. If that card is advanced element, put a durability counter on a Sword weapon you control and it gets +1POWER until end of turn.",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["WEAPON"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "banish",
                player: "controller",
                selection: {
                  id: "banished-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 3,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["memory"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                  method: "random",
                },
              },
              {
                kind: "for-each",
                collection: {
                  binding: "banished-cards",
                },
                bindEachAs: "that-card",
                effect: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                  to: "memory",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "referenced-cards",
                  },
                  filter: {
                    kind: "element-category",
                    value: "advanced",
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: "durability",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default lorraineHonedOperative;
