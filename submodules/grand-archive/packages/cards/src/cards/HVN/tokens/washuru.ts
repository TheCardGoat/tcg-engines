import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const washuru: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "k5iv040vcq",
  slug: "washuru",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "k5iv040vcq:face:default",
      catalogId: "k5iv040vcq",
      name: "Washuru",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FLOWER"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText: "At the beginning of your recollection phase, banish a card from your graveyard.",
      abilities: [
        {
          id: "k5iv040vcq-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, banish a card from your graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "banish",
            player: "controller",
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default washuru;
