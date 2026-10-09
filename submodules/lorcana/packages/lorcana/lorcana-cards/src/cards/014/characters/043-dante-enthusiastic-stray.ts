import type { CharacterCard } from "@tcg/lorcana-types";
import { danteEnthusiasticStrayI18n } from "./043-dante-enthusiastic-stray.i18n";

export const danteEnthusiasticStray: CharacterCard = {
  id: "3tB",
  canonicalId: "ci_3tB",
  slug: "lorcana-ci_3tB",
  printings: [
    {
      id: "set14-043",
      artId: "set14-043",
      setCode: "set14",
      collectorNumber: "43",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-043"],
  cardType: "character",
  name: "Dante",
  version: "Enthusiastic Stray",
  inkType: ["amethyst"],
  franchise: "Coco",
  set: "014",
  cardNumber: 43,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Anything for You",
      description:
        "When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "3tB-1",
      name: "Anything for You",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 2,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
      text: "Anything for You When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
    },
  ],
  i18n: danteEnthusiasticStrayI18n,
};
