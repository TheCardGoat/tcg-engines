import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tidalFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zRG5hmBcsP",
  slug: "tidal-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zRG5hmBcsP:face:default",
      catalogId: "zRG5hmBcsP",
      name: "Tidal Fractal ",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "On Enter: Target player puts the top two cards of their deck into their graveyard.\n\nReservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
      abilities: [
        {
          id: "zRG5hmBcsP-a1",
          kind: "triggered",
          text: "On Enter: Target player puts the top two cards of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
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
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: 2,
          },
        },
        {
          id: "zRG5hmBcsP-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
      ],
    },
  },
};

export default tidalFractal;
