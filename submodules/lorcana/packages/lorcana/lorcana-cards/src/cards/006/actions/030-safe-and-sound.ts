import type { ActionCard } from "@tcg/lorcana-types";
import { safeAndSoundI18n } from "./030-safe-and-sound.i18n";

export const safeAndSound: ActionCard = {
  id: "JNT",
  canonicalId: "ci_JNT",
  reprints: ["set6-030"],
  cardType: "action",
  name: "Safe and Sound",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  cardNumber: 30,
  rarity: "rare",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_cf72db3ded534d7086fb4ead70250f95",
    tcgPlayer: 593041,
  },
  text: "Chosen character of yours can't be challenged until the start of your next turn.",
  abilities: [
    {
      type: "action",
      text: "Chosen character of yours can't be challenged until the start of your next turn.",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        duration: "until-start-of-next-turn",
        target: "CHOSEN_CHARACTER_OF_YOURS",
      },
    },
  ],
  i18n: safeAndSoundI18n,
};
