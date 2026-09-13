import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const outfittedRavager: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "YZIyPCvgzH",
  slug: "outfitted-ravager",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "YZIyPCvgzH:face:default",
      catalogId: "YZIyPCvgzH",
      name: "Outfitted Ravager",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Whenever an object becomes linked to Outfitted Ravager, draw a card and discard a card. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "YZIyPCvgzH-a1",
          kind: "triggered",
          text: "[Class Bonus] Whenever an object becomes linked to Outfitted Ravager, draw a card and discard a card. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-linked",
              subject: {
                kind: "event-object",
              },
              host: {
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
            kind: "sequence",
            effects: [
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-card",
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
            ],
          },
        },
      ],
    },
  },
};

export default outfittedRavager;
