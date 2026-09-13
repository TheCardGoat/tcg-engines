import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slimecallCyclone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9Kgr2prI9E",
  slug: "slimecall-cyclone",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9Kgr2prI9E:face:default",
      catalogId: "9Kgr2prI9E",
      name: "Slimecall Cyclone",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SLIME", "SPELL"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "[Class Bonus] At the beginning of your recollection phase, summon a Baby Slime token. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "9Kgr2prI9E-a1",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, summon a Baby Slime token. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
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
          },
        },
      ],
    },
  },
};

export default slimecallCyclone;
