import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const entrancingFiligree: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vrf9n24b5a",
  slug: "entrancing-filigree",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vrf9n24b5a:face:default",
      catalogId: "vrf9n24b5a",
      name: "Entrancing Filigree",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "CRYSTAL"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "On Enter: As a Spell, banish target non-champion object you don't control. (Spell abilities can't target objects with spellshroud.)\n\nOn Leave: Return the banished object to the field under its owner's control rested.",
      abilities: [
        {
          id: "vrf9n24b5a-a1",
          kind: "triggered",
          text: "On Enter: As a Spell, banish target non-champion object you don't control. (Spell abilities can't target objects with spellshroud.)",
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
                player: "opponent",
                filter: {
                  kind: "not",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "banish-object",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
            },
          },
        },
        {
          id: "vrf9n24b5a-a2",
          kind: "triggered",
          text: "On Leave: Return the banished object to the field under its owner's control rested.",
          trigger: {
            kind: "event",
            event: {
              name: "object-left-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "tracked",
                  key: "banished-object",
                },
                from: "banishment",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "rest",
                subject: {
                  kind: "tracked",
                  key: "banished-object",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default entrancingFiligree;
