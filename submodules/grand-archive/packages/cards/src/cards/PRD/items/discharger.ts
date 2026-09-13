import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const discharger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wAq6lxxwBA",
  slug: "discharger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wAq6lxxwBA:face:default",
      catalogId: "wAq6lxxwBA",
      name: "Discharger",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText: "Banish Discharger: Remove four static counters from target object.",
      abilities: [
        {
          id: "wAq6lxxwBA-a1",
          kind: "activated",
          text: "Banish Discharger: Remove four static counters from target object.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
              },
            },
          ],
          effect: {
            kind: "remove-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "static",
            amount: 4,
            bindResultAs: "removed-counters",
          },
        },
      ],
    },
  },
};

export default discharger;
