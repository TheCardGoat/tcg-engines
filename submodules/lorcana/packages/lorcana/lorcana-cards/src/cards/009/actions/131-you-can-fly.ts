import type { ActionCard } from "@tcg/lorcana-types";
import { youCanFlyI18n } from "./131-you-can-fly.i18n";

export const youCanFly: ActionCard = {
  id: "trN",
  canonicalId: "ci_JGS",
  slug: "lorcana-ci_JGS",
  printings: [
    {
      id: "set9-131",
      artId: "set9-131",
      setCode: "set9",
      collectorNumber: "131",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-133", "set9-131"],
  cardType: "action",
  name: "You Can Fly!",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "009",
  cardNumber: 131,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_53b7756b77ee49df8373e45db50bd1de",
    tcgPlayer: "650066",
  },
  text: "Chosen character gains Evasive until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: youCanFlyI18n,
};
