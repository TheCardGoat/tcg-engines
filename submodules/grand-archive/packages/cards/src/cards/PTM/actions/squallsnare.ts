import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const squallsnare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cQZgiYS0w4",
  slug: "squallsnare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cQZgiYS0w4:face:default",
      catalogId: "cQZgiYS0w4",
      name: "Squallsnare",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "Suppress two target allies with the same reserve costs. (To suppress an object, banish it and return it to the field under its owner’s control at the beginning of the next end phase.)",
      abilities: [
        {
          id: "cQZgiYS0w4-a1",
          kind: "card-resolution",
          text: "Suppress two target allies with the same reserve costs. (To suppress an object, banish it and return it to the field under its owner’s control at the beginning of the next end phase.)",
          targets: [
            {
              id: "target-allies",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 2,
              },
              unique: true,
              allShareCharacteristic: "reserve-cost",
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
            kind: "keyword-action",
            action: "suppress",
            player: "controller",
            subject: {
              kind: "bound",
              binding: "target-allies",
            },
          },
        },
      ],
    },
  },
};

export default squallsnare;
