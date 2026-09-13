import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const maledictumVitae: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "24I0xn0OQ1",
  slug: "maledictum-vitae",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "24I0xn0OQ1:face:default",
      catalogId: "24I0xn0OQ1",
      name: "Maledictum Vitae",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER", "CURSE", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Put Maledictum Vitae on the bottom of target champion's lineage. \n\nWhenever this card is put into a champion's lineage, that champion's controller recovers 4.\n\n[Alice Bonus] [Element Bonus] (2), Banish another card from your graveyard: Put this card from your graveyard on the bottom of target champion's lineage. ",
      abilities: [
        {
          id: "24I0xn0OQ1-a1",
          kind: "card-resolution",
          text: "Put Maledictum Vitae on the bottom of target champion's lineage.",
          targets: [
            {
              id: "target-champion",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "inner-lineage",
              host: {
                kind: "bound",
                binding: "target-champion",
              },
              placement: {
                kind: "bottom",
              },
            },
          },
        },
        {
          id: "24I0xn0OQ1-a2",
          kind: "triggered",
          text: "Whenever this card is put into a champion's lineage, that champion's controller recovers 4.",
          trigger: {
            kind: "event",
            event: {
              name: "card-moved",
              subject: {
                kind: "source",
              },
              to: "inner-lineage",
              host: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
                bindAs: "lineage-champion",
              },
            },
          },
          effect: {
            kind: "recover",
            player: {
              controllerOf: "lineage-champion",
            },
            amount: 4,
          },
        },
        {
          id: "24I0xn0OQ1-a3",
          kind: "activated",
          text: "[Alice Bonus] [Element Bonus] (2), Banish another card from your graveyard: Put this card from your graveyard on the bottom of target champion's lineage.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "not-source",
                },
              },
            ],
          },
          targets: [
            {
              id: "target-champion",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Alice",
              },
            },
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            from: "graveyard",
            destination: {
              zone: "inner-lineage",
              host: {
                kind: "bound",
                binding: "target-champion",
              },
              placement: {
                kind: "bottom",
              },
            },
          },
          functionalZones: ["graveyard"],
        },
      ],
    },
  },
};

export default maledictumVitae;
