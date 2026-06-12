import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseArtfulRogueI18n } from "./088-mickey-mouse-artful-rogue.i18n";

export const mickeyMouseArtfulRogue: CharacterCard = {
  id: "PiO",
  canonicalId: "ci_8IO",
  reprints: ["set1-088"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Artful Rogue",
  inkType: ["emerald"],
  set: "001",
  cardNumber: 88,
  rarity: "common",
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_1a8604b7ba6c45e2bc8b32b0a70d08b5",
    tcgPlayer: 510156,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "MISDIRECTION",
      description:
        "Whenever you play an action, chosen opposing character can't quest during their next turn.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    {
      id: "dul-1",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      shiftTarget: "Mickey Mouse",
      type: "keyword",
    },
    {
      effect: {
        duration: "their-next-turn",
        restriction: "cant-quest",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "restriction",
      },
      id: "dul-2",
      name: "MISDIRECTION",
      text: "MISDIRECTION Whenever you play an action, chosen opposing character can't quest during their next turn.",
      trigger: {
        event: "play",
        on: "YOUR_ACTIONS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mickeyMouseArtfulRogueI18n,
};
