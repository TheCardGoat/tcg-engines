import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fleetfootFilly: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1hrgshgthu",
  slug: "fleetfoot-filly",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1hrgshgthu:face:default",
      catalogId: "1hrgshgthu",
      name: "Fleetfoot Filly",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "HORSE"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Whenever a player suppresses an object, put a buff counter on Fleetfoot Filly. (Allies get +1 power and +1 life for each buff counter on them.)",
      abilities: [
        {
          id: "1hrgshgthu-a1",
          kind: "triggered",
          text: "Whenever a player suppresses an object, put a buff counter on Fleetfoot Filly. (Allies get +1 power and +1 life for each buff counter on them.)",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              action: "suppress",
              subject: {
                kind: "event-object",
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default fleetfootFilly;
