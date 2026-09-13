import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const draughtOfStamina: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lpnvx7mnu1",
  slug: "draught-of-stamina",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lpnvx7mnu1:face:default",
      catalogId: "lpnvx7mnu1",
      name: "Draught of Stamina",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "POTION"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "Brew — One Springleaf, Two Herbs (You may sacrifice the listed objects rather than pay this card's reserve cost.) \n\nSacrifice Draught of Stamina: Wake up target ally you control.",
      abilities: [
        {
          id: "lpnvx7mnu1-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Brew — One Springleaf, Two Herbs (You may sacrifice the listed objects rather than pay this card's reserve cost.)",
          keyword: {
            name: "brew",
            requirements: [
              {
                kind: "name",
                value: "Springleaf",
                count: 1,
              },
              {
                kind: "subtype",
                value: "Herb",
                count: 2,
              },
            ],
          },
        },
        {
          id: "lpnvx7mnu1-a2",
          kind: "activated",
          text: "Sacrifice Draught of Stamina: Wake up target ally you control.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "wake",
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

export default draughtOfStamina;
