import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fullBloom: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5WP1TXJo9E",
  slug: "full-bloom",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5WP1TXJo9E:face:default",
      catalogId: "5WP1TXJo9E",
      name: "Full Bloom",
      cost: {
        kind: "reserve",
        amount: 7,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ULTIMATE", "SPELL"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "[Diao Chan Bonus] On Enter: Target opponent summons four Flowerbud tokens.\n\n[Diao Chan Bonus] Whenever an opponent summons a Flowerbud token, deal 2 damage to each champion that opponent controls and you recover 2.",
      abilities: [
        {
          id: "5WP1TXJo9E-a1",
          kind: "triggered",
          text: "[Diao Chan Bonus] On Enter: Target opponent summons four Flowerbud tokens.",
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
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Flowerbud",
            controller: {
              binding: "target-opponent",
            },
            amount: 4,
          },
        },
        {
          id: "5WP1TXJo9E-a2",
          kind: "triggered",
          text: "[Diao Chan Bonus] Whenever an opponent summons a Flowerbud token, deal 2 damage to each champion that opponent controls and you recover 2.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              actor: "opponent",
              subject: {
                kind: "event-object",
                controller: "opponent",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "token",
                      value: true,
                    },
                    {
                      kind: "name",
                      value: "Flowerbud",
                    },
                  ],
                },
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default fullBloom;
