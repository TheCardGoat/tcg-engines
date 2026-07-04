import type { CharacterCard } from "@tcg/lorcana-types";
import { dalmatianPuppyTailWaggerI18n } from "./038-dalmatian-puppy-tail-wagger.i18n";

export const dalmatianPuppyTailWagger: CharacterCard = {
  id: "kvV",
  canonicalId: "ci_kvV",
  slug: "lorcana-ci_kvV",
  printings: [
    {
      id: "set8-038",
      artId: "set8-038",
      setCode: "set8",
      collectorNumber: "38",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set8-038"],
  cardType: "character",
  name: "Dalmatian Puppy",
  version: "Tail Wagger",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "008",
  cardNumber: 38,
  rarity: "common",
  cardCopyLimit: 99,
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    lorcast: "crd_61323fccb37c45d9b2fb428f60adcf05",
    tcgPlayer: "631649",
  },
  text: [
    {
      title: "WHERE DID THEY ALL COME FROM?",
      description: "You may have up to 99 copies of Dalmatian Puppy — Tail Wagger in your deck.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
  i18n: dalmatianPuppyTailWaggerI18n,
};
