import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ladyTremaineOverbearingMatriarch: LorcanitoCharacterCardDefinition =
  {
    id: "yy6",

    name: "Lady Tremaine",
    title: "Overbearing Matriarch",
    characteristics: ["storyborn", "villain"],
    text: "**NOT FOR YOU** When you play this character, each opponent with more lore than you loses 1 lore.",
    type: "character",
    abilities: [
      {
        type: "resolution",
        name: "Not for You",
        text: "When you play this character, each opponent with more lore than you loses 1 lore.",
        // TODO: Add condition have less lore
        effects: [
          {
            type: "lore",
            amount: 1,
            modifier: "subtract",
            target: {
              type: "player",
              value: "opponent",
            },
          },
        ],
      },
    ],
    flavour:
      "Make no mistake: this time I will make certain the key remains safe!",
    colors: ["ruby"],
    cost: 2,
    strength: 2,
    willpower: 2,
    lore: 1,
    illustrator: "Samanta Erdini",
    number: 111,
    set: "ROF",
    rarity: "common",
  };
