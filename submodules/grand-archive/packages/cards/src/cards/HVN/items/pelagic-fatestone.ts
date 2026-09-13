import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pelagicFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tqkkyf4ktr",
  slug: "pelagic-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "tqkkyf4ktr:face:default",
      catalogId: "tqkkyf4ktr",
      name: "Pelagic Fatestone",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: Draw a card into your memory.\n\n[Guo Jia Bonus] Whenever this card is banished from your graveyard to pay for a memory cost, put it onto the field transformed.\n\nFloating Memory",
      abilities: [
        {
          id: "tqkkyf4ktr-a1",
          kind: "triggered",
          text: "On Enter: Draw a card into your memory.",
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
            to: "memory",
          },
        },
        {
          id: "tqkkyf4ktr-a2",
          kind: "triggered",
          text: "[Guo Jia Bonus] Whenever this card is banished from your graveyard to pay for a memory cost, put it onto the field transformed.",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              actor: "controller",
              subject: {
                kind: "source",
              },
              from: "graveyard",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            from: "banishment",
            destination: {
              zone: "field",
              face: "transformed",
            },
          },
        },
        {
          id: "tqkkyf4ktr-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
    flipFace: {
      id: "tqkkyf4ktr:face:flip",
      catalogId: "lildjctw73",
      name: "Slick Torrentrider",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "DOLPHIN"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        life: 3,
      },
      rulesText:
        "At the beginning of your recollection phase, put the top card of your deck into your graveyard.",
      abilities: [
        {
          id: "lildjctw73-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, put the top card of your deck into your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "mill",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default pelagicFatestone;
