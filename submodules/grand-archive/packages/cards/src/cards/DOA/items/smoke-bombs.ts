import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const smokeBombs: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ScGcOmkoQt",
  slug: "smoke-bombs",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ScGcOmkoQt:face:default",
      catalogId: "ScGcOmkoQt",
      name: "Smoke Bombs",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Smoke Bombs: Target ally gains stealth until end of turn. Draw a card. (Units with stealth can't be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "ScGcOmkoQt-a1",
          kind: "activated",
          text: "Banish Smoke Bombs: Target ally gains stealth until end of turn. Draw a card. (Units with stealth can't be targeted by attacks unless permitted by true sight.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
                },
                affectedSet: "locked",
                duration: {
                  kind: "this-turn",
                },
                layer: {
                  layer: "D",
                  modifies: "ability",
                },
                change: {
                  kind: "grant-keyword",
                  keyword: {
                    name: "stealth",
                  },
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default smokeBombs;
