import type { CharacterCard } from "@tcg/lorcana-types";
import { belleInventiveEngineerI18n } from "./156-belle-inventive-engineer.i18n";

export const belleInventiveEngineer: CharacterCard = {
  id: "LVg",
  canonicalId: "ci_xtR",
  slug: "lorcana-ci_xtR",
  printings: [
    {
      id: "set9-156",
      artId: "set9-156",
      setCode: "set9",
      collectorNumber: "156",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set1-141", "set9-156"],
  cardType: "character",
  name: "Belle",
  version: "Inventive Engineer",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "009",
  cardNumber: 156,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b77ec6c391cd4ccaa1b1e01ca897502d",
    tcgPlayer: "650091",
  },
  text: [
    {
      title: "TINKER",
      description:
        "Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess", "Inventor"],
  abilities: [
    {
      effect: {
        amount: 1,
        cardType: "item",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "11d-1",
      name: "TINKER",
      text: "TINKER Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: belleInventiveEngineerI18n,
};
