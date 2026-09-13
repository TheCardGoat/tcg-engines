import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const marchHareMottledHost: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7w4v1hgl3e",
  slug: "march-hare-mottled-host",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7w4v1hgl3e:face:default",
      catalogId: "7w4v1hgl3e",
      name: "March Hare, Mottled Host",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "ANIMAL", "HUMAN", "RABBIT"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Element Bonus] Whenever this card is banished from your graveyard to pay for a reserve cost, put it onto the field. (Apply this effect only if your champion's element matches this card's element.)",
      abilities: [
        {
          id: "7w4v1hgl3e-a1",
          kind: "triggered",
          text: "[Element Bonus] Whenever this card is banished from your graveyard to pay for a reserve cost, put it onto the field. (Apply this effect only if your champion's element matches this card's element.)",
          trigger: {
            kind: "event",
            event: {
              name: "card-banished",
              actor: "controller",
              subject: {
                kind: "source",
              },
              from: "graveyard",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            from: "banishment",
            destination: {
              zone: "field",
            },
          },
        },
      ],
    },
  },
};

export default marchHareMottledHost;
