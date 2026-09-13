import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const refractedTwilight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "me0xxw0plq",
  slug: "refracted-twilight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "me0xxw0plq:face:default",
      catalogId: "me0xxw0plq",
      name: "Refracted Twilight",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "Brew — Two Silvershine, Three Herbs\n\nBanish Refracted Twilight: The next time you activate an ability of target Potion this turn, copy that ability twice. You may choose new targets for those copies.",
      abilities: [
        {
          id: "me0xxw0plq-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Two Silvershine, Three Herbs",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "name",
                value: "Silvershine",
                count: 2,
              },
              {
                kind: "subtype",
                value: "Herb",
                count: 3,
              },
            ],
          },
        },
        {
          id: "me0xxw0plq-a2",
          kind: "activated",
          text: "Banish Refracted Twilight: The next time you activate an ability of target Potion this turn, copy that ability twice. You may choose new targets for those copies.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-potion",
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
                  kind: "subtype",
                  oneOf: ["POTION"],
                },
              },
            },
          ],
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "ability-activated",
                actor: "controller",
                subject: {
                  kind: "bound-object",
                  binding: "target-potion",
                },
              },
            },
            limit: 1,
            expires: {
              kind: "this-turn",
            },
            effect: {
              kind: "copy",
              subject: {
                kind: "event-subject",
              },
              copy: "ability",
              amount: 2,
              mayChooseNewTargets: true,
            },
          },
        },
      ],
    },
  },
};

export default refractedTwilight;
