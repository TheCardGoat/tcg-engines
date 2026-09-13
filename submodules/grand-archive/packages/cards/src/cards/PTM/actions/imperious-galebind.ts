import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperiousGalebind: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2goaqn7ImP",
  slug: "imperious-galebind",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2goaqn7ImP:face:default",
      catalogId: "2goaqn7ImP",
      name: "Imperious Galebind",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["EXALTED", "WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nSuppress up to three target allies, items, or weapons. (To suppress an object, banish it and return it to the field under its owner’s control at the beginning of the next end phase.)",
      abilities: [
        {
          id: "2goaqn7ImP-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "2goaqn7ImP-a2",
          kind: "card-resolution",
          text: "Suppress up to three target allies, items, or weapons. (To suppress an object, banish it and return it to the field under its owner’s control at the beginning of the next end phase.)",
          targets: [
            {
              id: "target-objects",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 3,
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
              binding: "target-objects",
            },
          },
        },
      ],
    },
  },
};

export default imperiousGalebind;
