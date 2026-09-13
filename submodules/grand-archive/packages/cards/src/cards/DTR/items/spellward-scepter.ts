import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const spellwardScepter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f6lxizyuml",
  slug: "spellward-scepter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f6lxizyuml:face:default",
      catalogId: "f6lxizyuml",
      name: "Spellward Scepter",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SCEPTER"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Hindered (This object enters the field rested.)\n\nREST, Banish Spellward Scepter: The activation of the next card you activate this turn can't be negated.",
      abilities: [
        {
          id: "f6lxizyuml-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object enters the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "f6lxizyuml-a2",
          kind: "activated",
          text: "REST, Banish Spellward Scepter: The activation of the next card you activate this turn can't be negated.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "banish-self",
              },
            ],
          },
          effect: {
            kind: "rule-modification",
            mode: "forbid",
            action: "negate",
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
      ],
    },
  },
};

export default spellwardScepter;
