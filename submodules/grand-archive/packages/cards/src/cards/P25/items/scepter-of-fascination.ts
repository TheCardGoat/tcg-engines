import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scepterOfFascination: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4864k12no2",
  slug: "scepter-of-fascination",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4864k12no2:face:default",
      catalogId: "4864k12no2",
      name: "Scepter of Fascination",
      cost: {
        kind: "memory",
        amount: 1,
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
        "On Enter: Draw a card. \n\n[Diao Chan Bonus] Banish Scepter of Fascination: Wake up your champion. Put two glimmer counters on your champion. (Activate this ability only if your champion is Diao Chan.)\n",
      abilities: [
        {
          id: "4864k12no2-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "4864k12no2-a2",
          kind: "activated",
          text: "[Diao Chan Bonus] Banish Scepter of Fascination: Wake up your champion. Put two glimmer counters on your champion. (Activate this ability only if your champion is Diao Chan.)",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Diao Chan",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "wake",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: {
                  named: "glimmer",
                },
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default scepterOfFascination;
