import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const imperialAlchemist: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ve1d47o7ea",
  slug: "imperial-alchemist",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ve1d47o7ea:face:default",
      catalogId: "ve1d47o7ea",
      name: "Imperial Alchemist",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: Gather. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)\n\nWhenever you brew a Potion, put a buff counter on Imperial Alchemist.",
      abilities: [
        {
          id: "ve1d47o7ea-a1",
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
        {
          id: "ve1d47o7ea-a2",
          kind: "triggered",
          text: "Whenever you brew a Potion, put a buff counter on Imperial Alchemist.",
          trigger: {
            kind: "event",
            event: {
              name: "keyword-action-performed",
              actor: "controller",
              action: "brew",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "subtype",
                  oneOf: ["POTION"],
                },
              },
            },
          },
          effect: {
            kind: "add-counter",
            subject: {
              kind: "source",
            },
            counter: "buff",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default imperialAlchemist;
