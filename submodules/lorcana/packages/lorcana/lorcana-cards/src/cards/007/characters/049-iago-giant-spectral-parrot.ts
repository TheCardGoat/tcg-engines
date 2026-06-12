import type { CharacterCard } from "@tcg/lorcana-types";
import { iagoGiantSpectralParrotI18n } from "./049-iago-giant-spectral-parrot.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { vanish } from "../../../helpers/abilities/vanish";

export const iagoGiantSpectralParrot: CharacterCard = {
  id: "vao",
  canonicalId: "ci_vao",
  reprints: ["set7-049"],
  cardType: "character",
  name: "Iago",
  version: "Giant Spectral Parrot",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "007",
  cardNumber: 49,
  rarity: "rare",
  cost: 4,
  strength: 4,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9510a7439adc4dc5b1f444e37334a32e",
    tcgPlayer: 618171,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "Vanish",
      description: "(When an opponent chooses this character for an action, banish them.)",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
  abilities: [evasive, vanish],
  i18n: iagoGiantSpectralParrotI18n,
};
