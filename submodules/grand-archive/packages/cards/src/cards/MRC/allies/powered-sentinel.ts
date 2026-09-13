import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const poweredSentinel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nbrfnrow8i",
  slug: "powered-sentinel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nbrfnrow8i:face:default",
      catalogId: "nbrfnrow8i",
      name: "Powered Sentinel",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "AUTOMATON"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: Deal 3 damage to your champion and summon a Powercell token rested. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "nbrfnrow8i-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Deal 3 damage to your champion and summon a Powercell token rested. (Apply this effect only if your champion’s class matches this card’s class.)",
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
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: 3,
              },
              {
                kind: "summon",
                object: "Powercell",
                controller: "controller",
                bindResultAs: "summoned-token",
                entersWithStates: ["rested"],
              },
            ],
          },
        },
      ],
    },
  },
};

export default poweredSentinel;
