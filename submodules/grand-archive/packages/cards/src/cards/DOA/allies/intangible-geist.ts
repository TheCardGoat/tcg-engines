import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const intangibleGeist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Zu53izIFTX",
  slug: "intangible-geist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Zu53izIFTX:face:default",
      catalogId: "Zu53izIFTX",
      name: "Intangible Geist",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPIRIT"],
      },
      elements: ["CRUX"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        "On Enter: You may choose any amount of regalia cards from your banishment and put them into your material deck.\n\n[Class Bonus] Prevent all combat damage that would be dealt to Intangible Geist.",
      abilities: [
        {
          id: "Zu53izIFTX-a1",
          kind: "triggered",
          text: "On Enter: You may choose any amount of regalia cards from your banishment and put them into your material deck.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "banished-cards-to-material",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "any-number",
                },
                candidates: {
                  kind: "card",
                  zones: ["banishment"],
                  relationship: "zone-of",
                  player: "controller",
                  filter: {
                    kind: "supertype",
                    oneOf: ["REGALIA"],
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "banished-cards-to-material",
                },
                from: "banishment",
                destination: {
                  zone: "material-deck",
                },
              },
            },
          },
        },
        {
          id: "Zu53izIFTX-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Prevent all combat damage that would be dealt to Intangible Geist.",
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
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
                combatDamage: true,
              },
              operation: {
                kind: "prevent",
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
      ],
    },
  },
};

export default intangibleGeist;
