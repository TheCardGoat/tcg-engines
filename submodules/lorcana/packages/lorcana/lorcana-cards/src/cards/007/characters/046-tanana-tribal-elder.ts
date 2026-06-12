import type { CharacterCard } from "@tcg/lorcana-types";
import { tananaTribalElderI18n } from "./046-tanana-tribal-elder.i18n";

export const tananaTribalElder: CharacterCard = {
  id: "ZGZ",
  canonicalId: "ci_ZGZ",
  reprints: ["set7-046"],
  cardType: "character",
  name: "Tanana",
  version: "Tribal Elder",
  inkType: ["amethyst"],
  franchise: "Brother Bear",
  set: "007",
  cardNumber: 46,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_fc616b53f3414fafa9aa52283d03fa3e",
    tcgPlayer: 618695,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: tananaTribalElderI18n,
};
