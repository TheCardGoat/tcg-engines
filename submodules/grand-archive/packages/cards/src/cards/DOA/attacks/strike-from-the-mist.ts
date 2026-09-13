import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const strikeFromTheMist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "DHn9J7gX6g",
  slug: "strike-from-the-mist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "DHn9J7gX6g:face:default",
      catalogId: "DHn9J7gX6g",
      name: "Strike from the Mist",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
      },
      rulesText:
        "Prepare 2 (You may remove two preparation counters from your champion as you activate this card.)\n\n[Class Bonus] As long as Strike from the Mist was prepared, it can't be intercepted.",
      abilities: [
        {
          id: "DHn9J7gX6g-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Prepare 2 (You may remove two preparation counters from your champion as you activate this card.)",
          keyword: {
            name: "prepare",
            value: 2,
          },
        },
        {
          id: "DHn9J7gX6g-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as Strike from the Mist was prepared, it can't be intercepted.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "intercept",
              against: {
                kind: "source",
              },
              condition: {
                kind: "activation-state",
                state: "prepared",
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

export default strikeFromTheMist;
