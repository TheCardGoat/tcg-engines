import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const erraticBolt: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "DqtlaMGMvd",
  slug: "erratic-bolt",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "DqtlaMGMvd:face:default",
      catalogId: "DqtlaMGMvd",
      name: "Erratic Bolt",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Deal LV damage to target unit. (LV refers to your champion's level.)\n\n[Class Bonus] You may banish two cards at random from your memory. If you do, draw two cards. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "DqtlaMGMvd-a1",
          kind: "card-resolution",
          text: "Deal LV damage to target unit. (LV refers to your champion's level.)",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "property",
              subject: {
                kind: "champion",
                player: "controller",
              },
              property: "level",
              basis: "current",
            },
          },
        },
        {
          id: "DqtlaMGMvd-a2",
          kind: "card-resolution",
          text: "[Class Bonus] You may banish two cards at random from your memory. If you do, draw two cards. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "banish",
                  player: "controller",
                  selection: {
                    id: "banished-cards",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 2,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                    method: "random",
                  },
                },
                {
                  kind: "draw",
                  player: "controller",
                  amount: 2,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default erraticBolt;
