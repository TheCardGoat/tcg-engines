import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slimeSwarm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5adaqTUV0i",
  slug: "slime-swarm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5adaqTUV0i:face:default",
      catalogId: "5adaqTUV0i",
      name: "Slime Swarm",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SLIME"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: Summon two Baby Slime tokens rested. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "5adaqTUV0i-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Summon two Baby Slime tokens rested. (Apply this effect only if your champion's class matches this card's class.)",
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
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "summon",
            object: "Baby Slime",
            controller: "controller",
            bindResultAs: "summoned-token",
            amount: 2,
            entersWithStates: ["rested"],
          },
        },
      ],
    },
  },
};

export default slimeSwarm;
