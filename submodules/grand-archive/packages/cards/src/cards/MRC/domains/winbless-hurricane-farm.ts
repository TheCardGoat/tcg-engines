import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const winblessHurricaneFarm: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1dvdlhtiym",
  slug: "winbless-hurricane-farm",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1dvdlhtiym:face:default",
      catalogId: "1dvdlhtiym",
      name: "Winbless Hurricane Farm",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["DOMAIN"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "FARM"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "At the beginning of your recollection phase, you may reveal three wind element cards from your memory. If you do, summon a Powercell token.",
      abilities: [
        {
          id: "1dvdlhtiym-a1",
          kind: "triggered",
          text: "At the beginning of your recollection phase, you may reveal three wind element cards from your memory. If you do, summon a Powercell token.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "reveal",
                  player: "controller",
                  selection: {
                    id: "reveal-selection",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 3,
                    },
                    candidates: {
                      kind: "card",
                      zones: ["memory"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["WIND"],
                      },
                    },
                  },
                },
                {
                  kind: "summon",
                  object: "Powercell",
                  controller: "controller",
                  bindResultAs: "summoned-token",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default winblessHurricaneFarm;
