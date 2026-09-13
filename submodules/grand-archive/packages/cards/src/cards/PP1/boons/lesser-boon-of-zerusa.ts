import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfZerusa: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UC9byG4aD5",
  slug: "lesser-boon-of-zerusa",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "UC9byG4aD5:face:default",
      catalogId: "UC9byG4aD5",
      name: "Lesser Boon of Zerusa",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Class Locked (Play this card only if your champion’s class matches this card’s class.)\n\n(2): Put a preparation counter on your champion. This ability costs (1) more to activate for each time you’ve activated it this game.",
      abilities: [
        {
          id: "UC9byG4aD5-a1",
          kind: "static",
          staticKind: "effects",
          text: "Class Locked (Play this card only if your champion’s class matches this card’s class.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "UC9byG4aD5-a2",
          kind: "activated",
          text: "(2): Put a preparation counter on your champion. This ability costs (1) more to activate for each time you’ve activated it this game.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 2,
          },
          costModifiers: [
            {
              operation: "add",
              amount: {
                kind: "event-total",
                event: {
                  name: "ability-activated",
                  subject: {
                    kind: "source",
                  },
                },
                window: "game",
                metric: "event-count",
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

export default lesserBoonOfZerusa;
