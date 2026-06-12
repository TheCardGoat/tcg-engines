import type { CharacterCard } from "@tcg/lorcana-types";
import { crikeeGoodLuckCharmI18n } from "./142-cri-kee-good-luck-charm.i18n";
import { alert } from "../../../helpers/abilities/alert";

export const crikeeGoodLuckCharm: CharacterCard = {
  id: "GwP",
  canonicalId: "ci_GwP",
  reprints: ["set10-142"],
  cardType: "character",
  name: "Cri-Kee",
  version: "Good Luck Charm",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "010",
  cardNumber: 142,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7b35f4aed143419a821f8426d17be7bf",
    tcgPlayer: 659454,
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [alert],
  i18n: crikeeGoodLuckCharmI18n,
};
