import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const essenceCrucible: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "DF5Ffwv7DJ",
  slug: "essence-crucible",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "DF5Ffwv7DJ:face:default",
      catalogId: "DF5Ffwv7DJ",
      name: "Essence Crucible",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Draw a card. \n\n[Arisanna Bonus] Whenever you brew a card, put a refinement counter on Essence Crucible.\n\nIf a Spell source you control would deal damage to one or more units, it deals that much damage plus X instead, where X is the amount of refinement counters on Essence Crucible.",
      abilities: [
        {
          id: "DF5Ffwv7DJ-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "DF5Ffwv7DJ-a2",
          kind: "triggered",
          text: "[Arisanna Bonus] Whenever you brew a card, put a refinement counter on Essence Crucible.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "brew",
              subject: {
                kind: "event-object",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Arisanna",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "refinement",
            },
            amount: 1,
          },
        },
        {
          id: "DF5Ffwv7DJ-a3",
          kind: "static",
          staticKind: "effects",
          text: "If a Spell source you control would deal damage to one or more units, it deals that much damage plus X instead, where X is the amount of refinement counters on Essence Crucible.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "refinement",
                },
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                subject: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["SPELL"],
                  },
                },
              },
              operation: {
                kind: "modify-amount",
                operation: "add",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default essenceCrucible;
