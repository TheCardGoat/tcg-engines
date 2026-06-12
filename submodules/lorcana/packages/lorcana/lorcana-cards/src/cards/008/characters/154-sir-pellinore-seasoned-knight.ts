import type { CharacterCard } from "@tcg/lorcana-types";
import { sirPellinoreSeasonedKnightI18n } from "./154-sir-pellinore-seasoned-knight.i18n";

export const sirPellinoreSeasonedKnight: CharacterCard = {
  id: "u5n",
  canonicalId: "ci_u5n",
  reprints: ["set8-154"],
  cardType: "character",
  name: "Sir Pellinore",
  version: "Seasoned Knight",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "008",
  cardNumber: 154,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b4a7b13bd7904038ac156d59dedf0023",
    tcgPlayer: 631829,
  },
  text: [
    {
      title: "CODE OF HONOR",
      description:
        "Whenever this character quests, your other characters gain Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
    },
  ],
  classifications: ["Storyborn", "Knight"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Support",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "6h9-1",
      name: "CODE OF HONOR",
      text: "CODE OF HONOR Whenever this character quests, your other characters gain Support this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: sirPellinoreSeasonedKnightI18n,
};
