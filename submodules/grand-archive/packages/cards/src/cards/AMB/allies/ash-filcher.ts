import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ashFilcher: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "b65hiv400w",
  slug: "ash-filcher",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "b65hiv400w:face:default",
      catalogId: "b65hiv400w",
      name: "Ash Filcher",
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
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Attack: You may banish a fire element card from your graveyard. If you do, this attack gets +2 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "b65hiv400w-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may banish a fire element card from your graveyard. If you do, this attack gets +2 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                      amount: 1,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                    },
                  },
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "E",
                    modifies: "stat",
                    sublayer: "modifier",
                  },
                  change: {
                    kind: "numeric",
                    property: "power",
                    operation: "add",
                    amount: 2,
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default ashFilcher;
