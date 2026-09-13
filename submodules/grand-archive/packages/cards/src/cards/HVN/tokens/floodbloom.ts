import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const floodbloom: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "4s1kmjeaks",
  slug: "floodbloom",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "4s1kmjeaks:face:default",
      catalogId: "4s1kmjeaks",
      name: "Floodbloom",
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
      rulesText:
        "At the beginning of your recollection phase, banish the top two cards of your deck.",
      abilities: [
        {
          id: "4s1kmjeaks-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, banish the top two cards of your deck.",
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
              id: "referenced-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 2,
              },
              candidates: {
                kind: "card",
                zones: ["main-deck"],
                relationship: "zone-of",
                player: "controller",
                fromTop: true,
              },
            },
          },
        },
      ],
    },
  },
};

export default floodbloom;
