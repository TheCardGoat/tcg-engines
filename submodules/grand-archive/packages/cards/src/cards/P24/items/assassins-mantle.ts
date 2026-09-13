import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const assassinsMantle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3tcs0axa03",
  slug: "assassins-mantle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3tcs0axa03:face:default",
      catalogId: "3tcs0axa03",
      name: "Assassin's Mantle",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "If your champion would take damage, you may banish Assassin's Mantle. If you do, prevent 1 of that damage. Put a preparation counter on your champion if damage was prevented this way.",
      abilities: [
        {
          id: "3tcs0axa03-a1",
          kind: "static",
          staticKind: "effects",
          text: "If your champion would take damage, you may banish Assassin's Mantle. If you do, prevent 1 of that damage. Put a preparation counter on your champion if damage was prevented this way.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
              optionalFor: "controller",
              operation: {
                kind: "sequence",
                operations: [
                  {
                    kind: "perform-before-commit",
                    effect: {
                      kind: "banish-object",
                      subject: {
                        kind: "source",
                      },
                    },
                  },
                  {
                    kind: "prevent",
                    amount: 1,
                  },
                ],
              },
              afterApply: {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default assassinsMantle;
