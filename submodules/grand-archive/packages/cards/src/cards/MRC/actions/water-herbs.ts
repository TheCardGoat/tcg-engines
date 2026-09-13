import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const waterHerbs: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1lyk1dvdlh",
  slug: "water-herbs",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1lyk1dvdlh:face:default",
      catalogId: "1lyk1dvdlh",
      name: "Water Herbs",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target player puts the top two cards of their deck into their graveyard. \n\n[Class Bonus] Gather. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
      abilities: [
        {
          id: "1lyk1dvdlh-a1",
          kind: "card-resolution",
          text: "Target player puts the top two cards of their deck into their graveyard.",
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
          id: "1lyk1dvdlh-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Gather. (To gather, summon a Blightroot, Manaroot, Silvershine, Fraysia, Razorvine, or Springleaf token, chosen at random.)",
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

export default waterHerbs;
