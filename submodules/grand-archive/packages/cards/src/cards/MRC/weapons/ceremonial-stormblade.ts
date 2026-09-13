import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ceremonialStormblade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "au5sw9f8uq",
  slug: "ceremonial-stormblade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "au5sw9f8uq:face:default",
      catalogId: "au5sw9f8uq",
      name: "Ceremonial Stormblade",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Put a durability counter on Ceremonial Stormblade for each wind element ally you control. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "au5sw9f8uq-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Put a durability counter on Ceremonial Stormblade for each wind element ally you control. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                  ],
                },
              },
            },
          ],
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
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "durability",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default ceremonialStormblade;
