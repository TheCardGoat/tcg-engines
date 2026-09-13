import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const escharotomy: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "CIU4gT14EE",
  slug: "escharotomy",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "CIU4gT14EE:face:default",
      catalogId: "CIU4gT14EE",
      name: "Escharotomy",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL", "REACTION"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target player can't recover until end of turn.\n\nEphemerate — (3) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
      abilities: [
        {
          id: "CIU4gT14EE-a1",
          kind: "card-resolution",
          text: "Target player can't recover until end of turn.",
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "rule-modification",
            mode: "forbid",
            action: "recover",
            subject: {
              kind: "player",
              player: {
                binding: "target-player",
              },
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "CIU4gT14EE-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (3) (You may activate this card from your graveyard by paying this cost. Action cards played this way become ephemeral on the effects stack.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "pay-reserve",
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default escharotomy;
