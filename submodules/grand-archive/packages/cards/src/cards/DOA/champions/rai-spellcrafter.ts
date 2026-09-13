import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const raiSpellcrafter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "gPKTJKqvOI",
  slug: "rai-spellcrafter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "gPKTJKqvOI:face:default",
      catalogId: "gPKTJKqvOI",
      name: "Rai, Spellcrafter",
      lineageName: "Rai",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 1,
        life: 19,
      },
      rulesText:
        "On Enter: Put two enlighten counters on Rai. (You may remove three enlighten counters from your champion to draw a card.)",
      abilities: [
        {
          id: "gPKTJKqvOI-a1",
          kind: "triggered",
          text: "On Enter: Put two enlighten counters on Rai. (You may remove three enlighten counters from your champion to draw a card.)",
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
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "enlighten",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default raiSpellcrafter;
