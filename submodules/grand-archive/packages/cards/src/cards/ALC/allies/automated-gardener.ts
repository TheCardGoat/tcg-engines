import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const automatedGardener: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xr93tig852",
  slug: "automated-gardener",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xr93tig852:face:default",
      catalogId: "xr93tig852",
      name: "Automated Gardener",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: Gather. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
      abilities: [
        {
          id: "xr93tig852-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Gather. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
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
            kind: "keyword-action",
            action: "gather",
          },
        },
      ],
    },
  },
};

export default automatedGardener;
