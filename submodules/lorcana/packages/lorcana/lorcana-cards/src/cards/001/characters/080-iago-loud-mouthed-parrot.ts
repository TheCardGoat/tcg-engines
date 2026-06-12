import type { CharacterCard } from "@tcg/lorcana-types";
import { iagoLoudmouthedParrotI18n } from "./080-iago-loud-mouthed-parrot.i18n";

export const iagoLoudmouthedParrot: CharacterCard = {
  id: "4Om",
  canonicalId: "ci_4Om",
  reprints: ["set1-080"],
  cardType: "character",
  name: "Iago",
  version: "Loud-Mouthed Parrot",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 80,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fb67b53a2df44bff96ca7fff2d607437",
    tcgPlayer: 497207,
  },
  text: [
    {
      title: "YOU GOT A PROBLEM?",
      description:
        "{E} — Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "j24-1",
      name: "YOU GOT A PROBLEM?",
      text: "YOU GOT A PROBLEM? {E} — Chosen character gains Reckless during their next turn.",
      type: "activated",
    },
  ],
  i18n: iagoLoudmouthedParrotI18n,
};
