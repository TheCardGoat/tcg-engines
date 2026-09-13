import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const extractionIncision: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zthwm68lgo",
  slug: "extraction-incision",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zthwm68lgo:face:default",
      catalogId: "zthwm68lgo",
      name: "Extraction Incision",
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
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "True Sight (This attack can target units with stealth.)\n\n[Class Bonus] On Kill: Put a preparation counter on your champion. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "zthwm68lgo-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "True Sight (This attack can target units with stealth.)",
          keyword: {
            name: "true-sight",
          },
        },
        {
          id: "zthwm68lgo-a2",
          kind: "triggered",
          text: "[Class Bonus] On Kill: Put a preparation counter on your champion. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
            },
          },
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
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default extractionIncision;
