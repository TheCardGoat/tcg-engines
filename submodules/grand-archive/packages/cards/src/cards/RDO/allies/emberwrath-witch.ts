import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const emberwrathWitch: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "PptfA8gG6h",
  slug: "emberwrath-witch",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "PptfA8gG6h:face:default",
      catalogId: "PptfA8gG6h",
      name: "Emberwrath Witch",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPECTER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "At the beginning of your end phase, sacrifice Emberwrath Witch.\n\nEphemerate — (2) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
      abilities: [
        {
          id: "PptfA8gG6h-a1",
          kind: "triggered",
          text: "At the beginning of your end phase, sacrifice Emberwrath Witch.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "end",
              actor: "controller",
            },
          },
          effect: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
        },
        {
          id: "PptfA8gG6h-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (2) (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default emberwrathWitch;
