import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prismspireScepter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mgesApvmwS",
  slug: "prismspire-scepter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mgesApvmwS:face:default",
      catalogId: "mgesApvmwS",
      name: "Prismspire Scepter",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "STAFF"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Merlin Bonus] On Enter: As a Spell, put two sheen counters on target champion you don't control.\n\n(3), Banish Prismspire Scepter: Draw a card into your memory.",
      abilities: [
        {
          id: "mgesApvmwS-a1",
          kind: "triggered",
          text: "[Merlin Bonus] On Enter: As a Spell, put two sheen counters on target champion you don't control.",
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
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
          effect: {
            kind: "perform-as",
            sourceKind: "spell",
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              counter: {
                named: "sheen",
              },
              amount: 2,
            },
          },
        },
        {
          id: "mgesApvmwS-a2",
          kind: "activated",
          text: "(3), Banish Prismspire Scepter: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default prismspireScepter;
