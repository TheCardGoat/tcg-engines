import type { CharacterCard } from "@tcg/lorcana-types";
import { meilinLeeSuperficiallyObedientI18n } from "./044-meilin-lee-superficially-obedient.i18n";

export const meilinLeeSuperficiallyObedient: CharacterCard = {
  id: "o4M",
  canonicalId: "ci_o4M",
  slug: "lorcana-ci_o4M",
  printings: [
    {
      id: "set13-044",
      artId: "set13-044",
      setCode: "set13",
      collectorNumber: "44",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-044"],
  cardType: "character",
  name: "Meilin Lee",
  version: "Superficially Obedient",
  inkType: ["amethyst"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 44,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b66349b8c7a045db98572d2efedc603b",
  },
  text: [
    {
      title: "NEWFOUND CONFIDENCE",
      description:
        "When you shift a character on top of her, this character gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Red Panda"],
  abilities: [
    {
      id: "o4M-1",
      name: "NEWFOUND CONFIDENCE",
      type: "triggered",
      text: "NEWFOUND CONFIDENCE When you shift a character on top of her, this character gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          shiftedOntoSelf: true,
        },
        timing: "when",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: {
          ref: "trigger-subject",
        },
      },
    },
  ],
  i18n: meilinLeeSuperficiallyObedientI18n,
};
