import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const minimalChar = (
  id: string,
  name: string,
  title: string,
  colors: (
    | "amber"
    | "amethyst"
    | "emerald"
    | "ruby"
    | "sapphire"
    | "steel"
  )[] = ["amber"],
  cost = 1,
  strength = 1,
  willpower = 1,
  lore = 1,
): LorcanaCharacterCardDefinition => ({
  id,
  type: "character",
  name,
  title,
  characteristics: ["storyborn"],
  inkwell: true,
  colors,
  cost,
  strength,
  willpower,
  lore,
  illustrator: "",
  number: 0,
  set: "006",
  rarity: "common",
});

export const liloEscapeArtist = minimalChar(
  "liloEscapeArtist",
  "Lilo",
  "Escape Artist",
);
export const abuBoldHelmsman = minimalChar(
  "abuBoldHelmsman",
  "Abu",
  "Bold Helmsman",
);

// Re-export the names module-style to satisfy tests that import from '/006'
export * from "./characters";
