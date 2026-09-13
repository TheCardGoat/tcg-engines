import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const direwolf: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "jev2kkxuq2",
  slug: "direwolf",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "jev2kkxuq2:face:default",
      catalogId: "jev2kkxuq2",
      name: "Direwolf",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "WOLF"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText: "At the beginning of your end phase, sacrifice Direwolf.",
      abilities: [
        {
          id: "jev2kkxuq2-a1",
          kind: "triggered",
          text: "At the beginning of your end phase, sacrifice Direwolf.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
  },
};

export default direwolf;
