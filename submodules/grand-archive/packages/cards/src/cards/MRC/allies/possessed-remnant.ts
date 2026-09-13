import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const possessedRemnant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lhtiymuyv3",
  slug: "possessed-remnant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lhtiymuyv3:face:default",
      catalogId: "lhtiymuyv3",
      name: "Possessed Remnant",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 3,
        life: 1,
      },
      rulesText:
        "[Tristan Bonus] On Death: Summon an Ominous Shadow token and recover 3. (Apply this effect only if your champion is Tristan.)",
      abilities: [
        {
          id: "lhtiymuyv3-a1",
          kind: "triggered",
          text: "[Tristan Bonus] On Death: Summon an Ominous Shadow token and recover 3. (Apply this effect only if your champion is Tristan.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
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
                name: "Tristan",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "summon",
                object: "Ominous Shadow",
                controller: "controller",
                bindResultAs: "summoned-token",
              },
              {
                kind: "recover",
                player: "controller",
                amount: 3,
              },
            ],
          },
        },
      ],
    },
  },
};

export default possessedRemnant;
