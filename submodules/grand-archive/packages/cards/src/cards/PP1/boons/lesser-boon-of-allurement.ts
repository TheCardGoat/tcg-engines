import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfAllurement: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JuKoCVIvCG",
  slug: "lesser-boon-of-allurement",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "JuKoCVIvCG:face:default",
      catalogId: "JuKoCVIvCG",
      name: "Lesser Boon of Allurement",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Class Locked (Play this card only if your champion’s class matches this card’s class.)\n\nAs you gain this boon, the next phantasia card you activate this turn costs (2) less to activate.\n\n(5): Draw a card into your memory. This ability costs (1) less to activate for each phantasia you control. Activate this ability only once.\n",
      abilities: [
        {
          id: "JuKoCVIvCG-a1",
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
          id: "JuKoCVIvCG-a2",
          kind: "triggered",
          text: "As you gain this boon, the next phantasia card you activate this turn costs (2) less to activate.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "type",
              oneOf: ["PHANTASIA"],
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 2,
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
        {
          id: "JuKoCVIvCG-a3",
          kind: "activated",
          text: "(5): Draw a card into your memory. This ability costs (1) less to activate for each phantasia you control. Activate this ability only once.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 5,
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
            },
          ],
          limit: {
            count: 1,
            per: "source-instance",
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default lesserBoonOfAllurement;
