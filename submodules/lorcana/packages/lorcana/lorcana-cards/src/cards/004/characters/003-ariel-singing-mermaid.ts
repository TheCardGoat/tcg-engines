import type { CharacterCard } from "@tcg/lorcana-types";
import { arielSingingMermaidI18n } from "./003-ariel-singing-mermaid.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const arielSingingMermaid: CharacterCard = {
  id: "nfQ",
  canonicalId: "ci_k8k",
  reprints: ["set4-003", "set9-015"],
  cardType: "character",
  name: "Ariel",
  version: "Singing Mermaid",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 3,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_4b656001901d4c34829cfe124d5c166b",
    tcgPlayer: 647652,
  },
  text: "Singer 7",
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [singer(7)],
  i18n: arielSingingMermaidI18n,
};
