import type { CharacterCard } from "@tcg/lorcana-types";
import { todNimbleFoxI18n } from "./072-tod-nimble-fox.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const todNimbleFox: CharacterCard = {
  id: "fT3",
  canonicalId: "ci_fT3",
  reprints: ["set12-072"],
  cardType: "character",
  name: "Tod",
  version: "Nimble Fox",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "012",
  cardNumber: 72,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b328d3d5de43456ba31bd637c44a24a8",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Hero"],
  abilities: [evasive],
  i18n: todNimbleFoxI18n,
};
