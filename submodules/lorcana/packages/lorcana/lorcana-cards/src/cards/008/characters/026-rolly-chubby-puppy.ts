import type { CharacterCard } from "@tcg/lorcana-types";
import { rollyChubbyPuppyI18n } from "./026-rolly-chubby-puppy.i18n";
import { support } from "../../../helpers/abilities/support";

export const rollyChubbyPuppy: CharacterCard = {
  id: "3aw",
  canonicalId: "ci_3aw",
  reprints: ["set8-026"],
  cardType: "character",
  name: "Rolly",
  version: "Chubby Puppy",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "008",
  cardNumber: 26,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b2cd67df2b87491f9b39c5d31e7b91d1",
    tcgPlayer: 631369,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "ADORABLE ANTICS",
      description:
        "When you play this character, you may put a character card from your discard into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
  abilities: [
    support,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "discard",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "f0i-2",
      name: "ADORABLE ANTICS",
      text: "ADORABLE ANTICS When you play this character, you may put a character card from your discard into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: rollyChubbyPuppyI18n,
};
