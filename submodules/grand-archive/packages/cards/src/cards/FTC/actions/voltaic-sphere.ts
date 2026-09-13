import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const voltaicSphere: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0op3nq0ymv",
  slug: "voltaic-sphere",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0op3nq0ymv:face:default",
      catalogId: "0op3nq0ymv",
      name: "Voltaic Sphere",
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
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Deal 3 damage to target unit. If that unit is an ally, deal 5 damage to it instead. \n\n[Class Bonus] Banish Voltaic Sphere from your graveyard: The next arcane element Spell card you activate this turn costs 1 less to activate.",
      abilities: [
        {
          id: "0op3nq0ymv-a1",
          kind: "card-resolution",
          text: "Deal 3 damage to target unit. If that unit is an ally, deal 5 damage to it instead.",
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
            kind: "conditional",
            condition: {
              kind: "subject-matches",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              filter: {
                kind: "type",
                oneOf: ["ALLY"],
              },
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 5,
            },
            else: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 3,
            },
          },
        },
        {
          id: "0op3nq0ymv-a2",
          kind: "activated",
          text: "[Class Bonus] Banish Voltaic Sphere from your graveyard: The next arcane element Spell card you activate this turn costs 1 less to activate.",
          activation: "ability",
          functionalZones: ["graveyard", "intent"],
          cost: {
            kind: "banish-self",
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
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "element",
                  oneOf: ["ARCANE"],
                },
                {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              ],
            },
            costKind: "reserve",
            costOperation: "subtract",
            amount: 1,
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
      ],
    },
  },
};

export default voltaicSphere;
