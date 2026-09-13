import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const royalOrdinance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UnOkglGVMN",
  slug: "royal-ordinance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UnOkglGVMN:face:default",
      catalogId: "UnOkglGVMN",
      name: "Royal Ordinance",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["EXALTED", "NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nRecover 3. Draw a card.",
      abilities: [
        {
          id: "UnOkglGVMN-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "UnOkglGVMN-a2",
          kind: "card-resolution",
          text: "Recover 3. Draw a card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 3,
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

export default royalOrdinance;
