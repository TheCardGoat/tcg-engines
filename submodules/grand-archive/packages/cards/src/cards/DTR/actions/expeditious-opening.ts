import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const expeditiousOpening: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "w1wgpeifd0",
  slug: "expeditious-opening",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "w1wgpeifd0:face:default",
      catalogId: "w1wgpeifd0",
      name: "Expeditious Opening",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN", "CLERIC"],
        subtypes: ["ASSASSIN", "CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "The next ally card you activate this turn can be activated as though it had fast activation.\n\nDraw a card into your memory.",
      abilities: [
        {
          id: "w1wgpeifd0-a1",
          kind: "card-resolution",
          text: "The next ally card you activate this turn can be activated as though it had fast activation.",
          effect: {
            kind: "rule-modification",
            mode: "allow",
            action: "activate-fast",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "type",
              oneOf: ["ALLY"],
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
          id: "w1wgpeifd0-a2",
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

export default expeditiousOpening;
