import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const prismaticCodex: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "czvy67nbin",
  slug: "prismatic-codex",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "czvy67nbin:face:default",
      catalogId: "czvy67nbin",
      name: "Prismatic Codex",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, put an age counter on Prismatic Codex.\n\nBanish Prismatic Codex: Ignore the elemental requirements of the next card you activate this turn. Activate this ability only if there are three or more age counters on Prismatic Codex.",
      abilities: [
        {
          id: "czvy67nbin-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, put an age counter on Prismatic Codex.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "age",
            },
            amount: 1,
          },
        },
        {
          id: "czvy67nbin-a2",
          kind: "activated",
          text: "Banish Prismatic Codex: Ignore the elemental requirements of the next card you activate this turn. Activate this ability only if there are three or more age counters on Prismatic Codex.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "has-counter",
            subject: {
              kind: "source",
            },
            counter: {
              named: "age",
            },
            comparison: {
              left: {
                kind: "counter-count",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "age",
                },
              },
              operator: "gte",
              right: 3,
            },
          },
          effect: {
            kind: "rule-modification",
            mode: "allow",
            action: "ignore-element-requirement",
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
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default prismaticCodex;
