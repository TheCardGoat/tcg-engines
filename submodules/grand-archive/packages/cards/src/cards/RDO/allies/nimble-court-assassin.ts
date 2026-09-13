import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const nimbleCourtAssassin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "i2vPUpbPEl",
  slug: "nimble-court-assassin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "i2vPUpbPEl:face:default",
      catalogId: "i2vPUpbPEl",
      name: "Nimble Court Assassin",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 4,
        life: 4,
      },
      rulesText:
        "Ambush, Vigor\n\nOn Enter: You gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
      abilities: [
        {
          id: "i2vPUpbPEl-a1",
          kind: "keyword-group",
          text: "Ambush, Vigor",
          keywords: [
            {
              name: "ambush",
            },
            {
              name: "vigor",
            },
          ],
        },
        {
          id: "i2vPUpbPEl-a2",
          kind: "triggered",
          text: "On Enter: You gain agility 3 for this turn. (Agility 3 — Return three cards from your memory to your hand at the beginning of the end phase.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "set-player-state",
            player: "controller",
            state: "agility",
            value: true,
            amount: 3,
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default nimbleCourtAssassin;
