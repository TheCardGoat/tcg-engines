import type { CharacterCard } from "@tcg/lorcana-types";
import { sinaVigilantParentI18n } from "./142-sina-vigilant-parent.i18n";
import { alert } from "../../../helpers/abilities/alert";

export const sinaVigilantParent: CharacterCard = {
  id: "KYV",
  canonicalId: "ci_KYV",
  reprints: ["set11-142"],
  cardType: "character",
  name: "Sina",
  version: "Vigilant Parent",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "011",
  cardNumber: 142,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6f3a637fc61e4ad084fc878c55ff543c",
    tcgPlayer: 673739,
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [alert],
  i18n: sinaVigilantParentI18n,
};
