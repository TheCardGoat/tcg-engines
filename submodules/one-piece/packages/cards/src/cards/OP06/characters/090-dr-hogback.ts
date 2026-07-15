import type { CharacterCard } from "@tcg/op-types";
import { op06DrHogback090I18n } from "./090-dr-hogback.i18n.ts";

export const op06DrHogback090: CharacterCard = {
  id: "OP06-090",
  canonicalId: "OP06-090",
  slug: "dr-hogback/op06-090",
  name: "Dr. Hogback",
  printings: [
    {
      id: "OP06-090",
      artId: "OP06-090",
      setCode: "OP06",
      collectorNumber: "090",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-090.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "wisdom",
  effect:
    '[On Play] You may return 2 cards from your trash to the bottom of your deck in any order: Add up to 1 "Thriller Bark Pirates" type card other than [Dr. Hogback] from your trash to your hand.',
  i18n: op06DrHogback090I18n,
};
