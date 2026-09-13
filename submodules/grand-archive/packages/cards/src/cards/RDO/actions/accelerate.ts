import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const accelerate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6yW2zOwWmU",
  slug: "accelerate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6yW2zOwWmU:face:default",
      catalogId: "6yW2zOwWmU",
      name: "Accelerate",
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
      speed: "fast",
      stats: {},
      rulesText:
        "The next card you activate this turn can be activated as though it had fast activation.\n\nDraw a card into your memory.\n",
      abilities: [
        {
          id: "6yW2zOwWmU-a1",
          kind: "card-resolution",
          text: "The next card you activate this turn can be activated as though it had fast activation.",
          effect: {
            kind: "rule-modification",
            mode: "allow",
            action: "activate-fast",
            subject: {
              kind: "player",
              player: "controller",
            },
            occurrence: {
              count: 1,
              window: "this-turn",
              actorScope: "same-player",
            },
            duration: {
              kind: "for-next-event",
              event: "card-activated",
              expires: {
                kind: "this-turn",
              },
            },
          },
        },
        {
          id: "6yW2zOwWmU-a2",
          kind: "card-resolution",
          text: "Draw a card into your memory.",
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default accelerate;
