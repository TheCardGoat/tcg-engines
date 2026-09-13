import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const apotheosisRite: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "df594Qoszn",
  slug: "apotheosis-rite",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "df594Qoszn:face:default",
      catalogId: "df594Qoszn",
      name: "Apotheosis Rite",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "RING"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Divine Relic\n\nBanish Apotheosis Rite: Your champion becomes an Ascendant in addition to its other types. Draw a card.",
      abilities: [
        {
          id: "df594Qoszn-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Divine Relic",
          keyword: {
            name: "divine-relic",
          },
        },
        {
          id: "df594Qoszn-a2",
          kind: "activated",
          text: "Banish Apotheosis Rite: Your champion becomes an Ascendant in addition to its other types. Draw a card.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "champion",
                  player: "controller",
                },
                affectedSet: "locked",
                duration: {
                  kind: "permanent",
                },
                layer: {
                  layer: "B",
                  modifies: "type",
                },
                change: {
                  kind: "add-characteristic",
                  characteristic: {
                    kind: "subtype",
                    value: "ASCENDANT",
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

export default apotheosisRite;
