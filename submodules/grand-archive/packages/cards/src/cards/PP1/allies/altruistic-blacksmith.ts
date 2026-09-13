import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const altruisticBlacksmith: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Pd4hj3sveV",
  slug: "altruistic-blacksmith",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "Pd4hj3sveV:face:default",
      catalogId: "Pd4hj3sveV",
      name: "Altruistic Blacksmith",
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
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Intercept\n\n[Class Bonus] On Enter: Each player summons a Cheap Sword token. You gain the Crowd's Favor status.",
      abilities: [
        {
          id: "Pd4hj3sveV-a1",
          kind: "triggered",
          intrinsic: true,
          text: "Intercept",
          keyword: {
            name: "intercept",
          },
        },
        {
          id: "Pd4hj3sveV-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Each player summons a Cheap Sword token. You gain the Crowd's Favor status.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                object: "Cheap Sword",
                controller: "each-player",
              },
              {
                kind: "set-player-state",
                player: "controller",
                state: {
                  named: "Crowd's Favor",
                },
                value: true,
              },
            ],
          },
        },
      ],
    },
  },
};

export default altruisticBlacksmith;
