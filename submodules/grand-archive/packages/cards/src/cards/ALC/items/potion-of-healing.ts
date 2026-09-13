import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const potionOfHealing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qtb31x97n2",
  slug: "potion-of-healing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qtb31x97n2:face:default",
      catalogId: "qtb31x97n2",
      name: "Potion of Healing",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Brew — Two Herbs (You may sacrifice the listed objects rather than pay this card's reserve cost.) \n\nSacrifice Potion of Healing: Recover 5. (To recover, remove that many damage counters from your champion.)",
      abilities: [
        {
          id: "qtb31x97n2-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — Two Herbs (You may sacrifice the listed objects rather than pay this card's reserve cost.)",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "subtype",
                value: "Herb",
                count: 2,
              },
            ],
          },
        },
        {
          id: "qtb31x97n2-a2",
          kind: "activated",
          text: "Sacrifice Potion of Healing: Recover 5. (To recover, remove that many damage counters from your champion.)",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "recover",
            player: "controller",
            amount: 5,
          },
        },
      ],
    },
  },
};

export default potionOfHealing;
