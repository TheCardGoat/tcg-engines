import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../../helpers/abilities/evasive";
import { flotsamSlipperyAsAnEelI18n } from "./071-flotsam-slippery-as-an-eel.i18n";

export const flotsamSlipperyAsAnEel: CharacterCard = {
  id: "gWd",
  canonicalId: "ci_gWd",
  reprints: ["set10-071"],
  cardType: "character",
  name: "Flotsam",
  version: "Slippery as an Eel",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "010",
  cardNumber: 71,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_478ffd8c6de24f6c8beda8f4863b7154",
    tcgPlayer: 659421,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: flotsamSlipperyAsAnEelI18n,
};
