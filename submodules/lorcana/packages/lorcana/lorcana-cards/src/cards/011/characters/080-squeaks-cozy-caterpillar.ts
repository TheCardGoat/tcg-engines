import type { CharacterCard } from "@tcg/lorcana-types";
import { squeaksCozyCaterpillarI18n } from "./080-squeaks-cozy-caterpillar.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const squeaksCozyCaterpillar: CharacterCard = {
  id: "5ok",
  canonicalId: "ci_5ok",
  reprints: ["set11-080"],
  cardType: "character",
  name: "Squeaks",
  version: "Cozy Caterpillar",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 80,
  rarity: "common",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c583ec314a73469d890da787bcb08426",
    tcgPlayer: 676200,
  },
  text: "Evasive",
  classifications: ["Storyborn"],
  abilities: [evasive],
  i18n: squeaksCozyCaterpillarI18n,
};
