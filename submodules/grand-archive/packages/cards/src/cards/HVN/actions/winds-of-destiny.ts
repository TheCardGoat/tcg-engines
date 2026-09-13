import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windsOfDestiny: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "nhk5d19n82",
  slug: "winds-of-destiny",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "nhk5d19n82:face:default",
      catalogId: "nhk5d19n82",
      name: "Winds of Destiny",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "You may rest two Fatestones you control rather than pay this card's reserve cost.\n\nSuppress target ally, item, or weapon. (To suppress an object, banish it and return it to the field under its owner's control at the beginning of the next end phase.)",
      abilities: [
        {
          id: "nhk5d19n82-a1",
          kind: "static",
          staticKind: "effects",
          text: "You may rest two Fatestones you control rather than pay this card's reserve cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "select-and-rest",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 2,
                },
                filter: {
                  kind: "subtype",
                  oneOf: ["FATESTONE"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "nhk5d19n82-a2",
          kind: "card-resolution",
          text: "Suppress target ally, item, or weapon. (To suppress an object, banish it and return it to the field under its owner's control at the beginning of the next end phase.)",
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
                  oneOf: ["ALLY", "ITEM", "WEAPON"],
                },
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "suppress",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
      ],
    },
  },
};

export default windsOfDestiny;
