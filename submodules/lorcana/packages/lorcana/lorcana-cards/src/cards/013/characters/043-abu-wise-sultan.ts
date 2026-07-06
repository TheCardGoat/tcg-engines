import type { CharacterCard } from "@tcg/lorcana-types";
import { abuWiseSultanI18n } from "./043-abu-wise-sultan.i18n";

export const abuWiseSultan: CharacterCard = {
  id: "fpN",
  canonicalId: "ci_fpN",
  slug: "lorcana-ci_fpN",
  printings: [
    {
      id: "set13-043",
      artId: "set13-043",
      setCode: "set13",
      collectorNumber: "43",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-043"],
  cardType: "character",
  name: "Abu",
  version: "Wise Sultan",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "013",
  cardNumber: 43,
  rarity: "uncommon",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Ruler for a Day",
      description: "When this character quests, banish him.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "triggered",
      name: "RULER FOR A DAY",
      text: "RULER FOR A DAY When this character quests, banish him.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "banish",
        target: "SELF",
      },
    },
  ],
  i18n: abuWiseSultanI18n,
};
