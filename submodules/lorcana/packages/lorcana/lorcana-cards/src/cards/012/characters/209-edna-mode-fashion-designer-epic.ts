import type { CharacterCard } from "@tcg/lorcana-types";
import { ednaModeFashionDesignerEpicI18n } from "./209-edna-mode-fashion-designer-epic.i18n";
import { ednaModeFashionDesigner } from "./054-edna-mode-fashion-designer";

export const ednaModeFashionDesignerEpic: CharacterCard = {
  ...ednaModeFashionDesigner,
  id: "eKu",
  cardNumber: 209,
  rarity: "common",
  specialRarity: "epic",
  i18n: ednaModeFashionDesignerEpicI18n,
};
