import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanStandingHerGroundI18n } from "./126-mulan-standing-her-ground.i18n";

export const mulanStandingHerGround: CharacterCard = {
  id: "bX2",
  canonicalId: "ci_71H",
  reprints: ["set10-126"],
  cardType: "character",
  name: "Mulan",
  version: "Standing Her Ground",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "010",
  cardNumber: 126,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_082177dd6df34573a455c5f1b2ddad31",
    tcgPlayer: 660362,
  },
  text: [
    {
      title: "FLOWING BLADE",
      description:
        "During your turn, if you've put a card under one of your characters or locations this turn, this character takes no damage from challenges.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      id: "bX2-1",
      type: "static",
      name: "FLOWING BLADE",
      text: "FLOWING BLADE During your turn, if you've put a card under one of your characters or locations this turn, this character takes no damage from challenges.",
      condition: {
        type: "and",
        conditions: [{ type: "your-turn" }, { type: "put-card-under-any-this-turn" }],
      },
      effect: {
        type: "grant-ability",
        ability: "takes-no-damage-from-challenges",
        target: "SELF",
      },
    },
  ],
  i18n: mulanStandingHerGroundI18n,
};
