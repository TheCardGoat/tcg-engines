import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spellshieldTera: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yunjm0of8e",
  slug: "spellshield-tera",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yunjm0of8e:face:default",
      catalogId: "yunjm0of8e",
      name: "Spellshield: Tera",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL", "REACTION"],
      },
      elements: ["TERA"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to activate.\n\nThe next time damage would be dealt to your champion this turn, prevent that damage. Reveal an amount of cards from the top of your deck equal to the amount of damage prevented this way and put them into your material deck preserved.",
      abilities: [
        {
          id: "yunjm0of8e-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "yunjm0of8e-a2",
          kind: "card-resolution",
          text: "The next time damage would be dealt to your champion this turn, prevent that damage. Reveal an amount of cards from the top of your deck equal to the amount of damage prevented this way and put them into your material deck preserved.",
          effect: {
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
            operation: {
              kind: "prevent",
            },
            duration: {
              kind: "for-next-event",
              event: "damage-dealt",
              expires: {
                kind: "this-turn",
              },
            },
            afterApply: {
              kind: "reveal",
              player: "controller",
              selection: {
                id: "reveal-selection",
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
                    kind: "object-state",
                    state: "preserved",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default spellshieldTera;
