import type { ActionCard } from "@tcg/lorcana-types";
import { imStuckI18n } from "./063-im-stuck.i18n";

export const imStuck: ActionCard = {
  id: "HjB",
  canonicalId: "ci_KhI",
  reprints: ["set2-063", "set9-063"],
  cardType: "action",
  name: "I'm Stuck!",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "002",
  cardNumber: 63,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8dedb2a4e41e48039aea2bca6938d28f",
    tcgPlayer: 650007,
  },
  text: "Chosen exerted character can't ready at the start of their next turn.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "restriction",
        duration: "until-start-of-next-turn",
        restriction: "cant-ready",
        target: "CHOSEN_EXERTED_CHARACTER",
      },
    },
  ],
  i18n: imStuckI18n,
};
