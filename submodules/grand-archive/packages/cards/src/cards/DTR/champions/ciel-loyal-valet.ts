import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cielLoyalValet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nn48ne8a05",
  slug: "ciel-loyal-valet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nn48ne8a05:face:default",
      catalogId: "nn48ne8a05",
      name: "Ciel, Loyal Valet",
      lineageName: "Ciel",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 20,
      },
      rulesText:
        "On Enter: You gain the Servile Possessions mastery.\n\nInherited Effect — At the beginning of your end phase, you may banish a card from your graveyard or hand and put an omen counter on it.",
      abilities: [
        {
          id: "nn48ne8a05-a1",
          kind: "triggered",
          text: "On Enter: You gain the Servile Possessions mastery.",
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
            kind: "gain-mastery",
            player: "controller",
            mastery: "Servile Possessions",
          },
        },
        {
          id: "nn48ne8a05-a2",
          kind: "triggered",
          text: "Inherited Effect — At the beginning of your end phase, you may banish a card from your graveyard or hand and put an omen counter on it.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "banish",
              player: "controller",
              selection: {
                id: "banished-cards",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                candidates: {
                  kind: "card",
                  zones: ["hand"],
                  relationship: "zone-of",
                  player: "controller",
                },
              },
            },
          },
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

export default cielLoyalValet;
