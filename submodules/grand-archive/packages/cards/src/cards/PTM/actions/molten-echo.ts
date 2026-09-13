import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const moltenEcho: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "p7FWS3DA4a",
  slug: "molten-echo",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "p7FWS3DA4a:face:default",
      catalogId: "p7FWS3DA4a",
      name: "Molten Echo",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Merlin Bonus] Kindle 2\n\nDeal 1 damage to target unit. Then put a sheen counter on your Fractured Memories. \n\n[Merlin Bonus] Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
      abilities: [
        {
          id: "p7FWS3DA4a-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Merlin Bonus] Kindle 2",
          keyword: {
            name: "kindle",
            value: 2,
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
        },
        {
          id: "p7FWS3DA4a-a2",
          kind: "card-resolution",
          text: "Deal 1 damage to target unit. Then put a sheen counter on your Fractured Memories.",
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
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 1,
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "name",
                      value: "Fractured Memories",
                    },
                  },
                },
                counter: {
                  named: "sheen",
                },
                amount: 1,
              },
            ],
          },
        },
        {
          id: "p7FWS3DA4a-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Merlin Bonus] Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Merlin",
              },
            },
          ],
        },
      ],
    },
  },
};

export default moltenEcho;
