import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const barterHerbs: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "p5af098kmo",
  slug: "barter-herbs",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "p5af098kmo:face:default",
      catalogId: "p5af098kmo",
      name: "Barter Herbs",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        "Sacrifice up to two Herbs. For each Herb sacrificed this way, summon your choice of Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token. \n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "p5af098kmo-a1",
          kind: "card-resolution",
          text: "Sacrifice up to two Herbs. For each Herb sacrificed this way, summon your choice of Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token.",
          effect: {
            kind: "choose",
            selection: {
              id: "sacrificed-herbs",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["HERB"],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "sacrifice",
                  subject: {
                    kind: "bound",
                    binding: "sacrificed-herbs",
                  },
                  bindResultAs: "sacrificed-herbs-result",
                },
                {
                  kind: "repeat",
                  count: {
                    kind: "modified-ability-result-amount",
                    metric: "objects-sacrificed",
                  },
                  effect: {
                    kind: "summon-one-of",
                    chooser: "controller",
                    controller: "controller",
                    objects: [
                      "Blightroot",
                      "Manaroot",
                      "Silvershine",
                      "Fraysia",
                      "Razorvine",
                      "Springleaf",
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          id: "p5af098kmo-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
          keyword: {
            name: "floating-memory",
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
        },
      ],
    },
  },
};

export default barterHerbs;
