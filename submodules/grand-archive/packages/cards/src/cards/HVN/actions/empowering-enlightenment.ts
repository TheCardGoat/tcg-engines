import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const empoweringEnlightenment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bo0n07e53e",
  slug: "empowering-enlightenment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bo0n07e53e:face:default",
      catalogId: "bo0n07e53e",
      name: "Empowering Enlightenment",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Empower 2. Put an enlighten counter on your champion. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level. You may remove three enlighten counters from your champion to draw a card.)",
      abilities: [
        {
          id: "bo0n07e53e-a1",
          kind: "card-resolution",
          text: "Empower 2. Put an enlighten counter on your champion. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level. You may remove three enlighten counters from your champion to draw a card.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "keyword-action",
                action: "empower",
                amount: 2,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "enlighten",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default empoweringEnlightenment;
