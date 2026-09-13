import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ouraganSentinel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2zs1pana81",
  slug: "ouragan-sentinel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2zs1pana81:face:default",
      catalogId: "2zs1pana81",
      name: "Ouragan Sentinel",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Ciel Bonus] On Enter: Summon a Vacuous Servant token. (Apply this effect only if your champion is Ciel.)",
      abilities: [
        {
          id: "2zs1pana81-a1",
          kind: "triggered",
          text: "[Ciel Bonus] On Enter: Summon a Vacuous Servant token. (Apply this effect only if your champion is Ciel.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Vacuous Servant",
            controller: "controller",
            bindResultAs: "summoned-token",
          },
        },
      ],
    },
  },
};

export default ouraganSentinel;
