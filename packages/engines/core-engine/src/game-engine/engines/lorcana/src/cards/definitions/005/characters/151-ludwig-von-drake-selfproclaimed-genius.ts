import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ludwigVonDrakeSelfproclaimedGenius: LorcanitoCharacterCardDefinition =
  {
    id: "hbw",
    name: "Ludwig Von Drake",
    title: "Self-Proclaimed Genius",
    characteristics: ["storyborn", "ally"],
    type: "character",
    flavour:
      "So you see, there’s a dark void at the edge of Lorcana. A complete absence of electromagnetic radiation! What’s it made of? I don’t know! The light’s just gone. Kaput!",
    inkwell: true,
    colors: ["sapphire"],
    cost: 5,
    strength: 4,
    willpower: 4,
    lore: 3,
    illustrator: "Matt Chapman",
    number: 151,
    set: "SSK",
    rarity: "uncommon",
  };
