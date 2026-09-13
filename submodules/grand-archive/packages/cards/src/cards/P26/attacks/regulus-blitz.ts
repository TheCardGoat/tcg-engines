import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const regulusBlitz: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "y7o97Xbidv",
  slug: "regulus-blitz",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "y7o97Xbidv:face:default",
      catalogId: "y7o97Xbidv",
      name: "Regulus Blitz",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 4,
      },
      rulesText:
        "[Mordred Bonus] Banish a card with floating memory from your graveyard: Negate each card activation you don't control unless its controller pays (2). \n\n[Mordred Bonus] (2), Discard this card from your hand: The next non-Command attack card you activate this turn doesn't rest its attacker as part of its cost.",
      abilities: [
        {
          id: "y7o97Xbidv-a1",
          kind: "card-resolution",
          text: "[Mordred Bonus] Banish a card with floating memory from your graveyard: Negate each card activation you don't control unless its controller pays (2).",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Mordred",
              },
            },
          ],
          effect: {
            kind: "unless-paid",
            player: "event-recipient-controller",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
            otherwise: {
              kind: "banish",
              player: "controller",
              selection: {
                id: "banished-cards",
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
                  filter: {
                    kind: "has-keyword",
                    keyword: "floating-memory",
                  },
                },
              },
            },
          },
        },
        {
          id: "y7o97Xbidv-a2",
          kind: "activated",
          text: "[Mordred Bonus] (2), Discard this card from your hand: The next non-Command attack card you activate this turn doesn't rest its attacker as part of its cost.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "discard-self",
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Mordred",
              },
            },
          ],
          effect: {
            kind: "rule-modification",
            mode: "modify-cost",
            action: "activate",
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ATTACK"],
                },
                {
                  kind: "not",
                  filter: {
                    kind: "subtype",
                    oneOf: ["COMMAND"],
                  },
                },
              ],
            },
            costComponent: "rest-attacker",
            costOperation: "set",
            amount: 0,
            occurrence: {
              count: 1,
              window: "this-turn",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default regulusBlitz;
