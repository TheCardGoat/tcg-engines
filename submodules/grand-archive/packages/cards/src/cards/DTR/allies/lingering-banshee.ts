import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lingeringBanshee: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v0gu8efq08",
  slug: "lingering-banshee",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v0gu8efq08:face:default",
      catalogId: "v0gu8efq08",
      name: "Lingering Banshee",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SPECTER"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "Ephemerate — (6). As long as you control one or more ephemeral objects, this card costs (3) less to activate this way. (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
      abilities: [
        {
          id: "v0gu8efq08-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (6). As long as you control one or more ephemeral objects, this card costs (3) less to activate this way. (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 6,
            },
            costModifiers: [
              {
                operation: "subtract",
                amount: 3,
                condition: {
                  kind: "controls",
                  player: "controller",
                  filter: {
                    kind: "object-state",
                    state: "ephemeral",
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default lingeringBanshee;
