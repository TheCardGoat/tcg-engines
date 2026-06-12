import type { ActionCard } from "@tcg/lorcana-types";
import { motherWillProtectYouI18n } from "./030-mother-will-protect-you.i18n";

export const motherWillProtectYou: ActionCard = {
  id: "30F",
  canonicalId: "ci_30F",
  reprints: ["set11-030"],
  cardType: "action",
  name: "Mother Will Protect You",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "011",
  cardNumber: 30,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_026951e834c74886a9c05341b713b3fa",
    tcgPlayer: 677133,
  },
  text: "Chosen character can't be challenged until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Chosen character can't be challenged until the start of your next turn.",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "CHOSEN_CHARACTER",
        duration: "until-start-of-next-turn",
      },
    },
  ],
  i18n: motherWillProtectYouI18n,
};
