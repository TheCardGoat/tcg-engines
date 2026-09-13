import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const excaliburCursedSword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4sm14RaEkg",
  slug: "excalibur-cursed-sword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4sm14RaEkg:face:default",
      catalogId: "4sm14RaEkg",
      name: "Excalibur, Cursed Sword",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: Choose a player. That player gains control of Excalibur. (Apply this effect only if your champion's class matches this card's class.)\n\nWhenever you materialize a card, deal 2 damage to your champion.",
      abilities: [
        {
          id: "4sm14RaEkg-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Choose a player. That player gains control of Excalibur. (Apply this effect only if your champion's class matches this card's class.)",
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
                kind: "choose",
                selection: {
                  id: "chosen-player",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "player",
                    players: ["controller", "opponent", "another-player"],
                  },
                },
              },
              {
                kind: "change-control",
                subject: {
                  kind: "source",
                },
                controller: {
                  binding: "chosen-player",
                },
              },
            ],
          },
        },
        {
          id: "4sm14RaEkg-a2",
          kind: "triggered",
          text: "Whenever you materialize a card, deal 2 damage to your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "card-materialized",
              actor: "controller",
              subject: {
                kind: "event-object",
              },
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "champion",
              player: "controller",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default excaliburCursedSword;
