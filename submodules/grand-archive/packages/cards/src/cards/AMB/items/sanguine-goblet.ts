import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sanguineGoblet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mnz5kgifhd",
  slug: "sanguine-goblet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mnz5kgifhd:face:default",
      catalogId: "mnz5kgifhd",
      name: "Sanguine Goblet",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Whenever your champion takes damage, put that many blood counters on Sanguine Goblet.\n\nBanish Sanguine Goblet: Draw a card. Activate this ability only if Sanguine Goblet has eight or more blood counters on it.",
      abilities: [
        {
          id: "mnz5kgifhd-a1",
          kind: "triggered",
          text: "Whenever your champion takes damage, put that many blood counters on Sanguine Goblet.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "blood",
            },
            amount: {
              kind: "event-amount",
            },
          },
        },
        {
          id: "mnz5kgifhd-a2",
          kind: "activated",
          text: "Banish Sanguine Goblet: Draw a card. Activate this ability only if Sanguine Goblet has eight or more blood counters on it.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "blood",
                },
              },
              operator: "gte",
              right: 8,
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default sanguineGoblet;
