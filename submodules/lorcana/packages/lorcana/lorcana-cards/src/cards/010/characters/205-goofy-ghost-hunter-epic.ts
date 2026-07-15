import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyGhostHunterEpicI18n } from "./205-goofy-ghost-hunter-epic.i18n";

export const goofyGhostHunterEpic: CharacterCard = {
  id: "iLZ",
  canonicalId: "ci_A5H",
  slug: "lorcana-ci_A5H",
  printings: [
    {
      id: "set10-205-epic",
      artId: "ci_A5H-epic",
      setCode: "set10",
      collectorNumber: "205",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-021"],
  cardType: "character",
  name: "Goofy",
  version: "Ghost Hunter",
  inkType: ["amber"],
  set: "010",
  cardNumber: 205,
  rarity: "common",
  specialRarity: "epic",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6283ca50c61544b7a6226fadbc7f0a17",
    tcgPlayer: "660359",
  },
  text: [
    {
      title: "PERFECT TRAP",
      description:
        "When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -1,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "1mg-1",
      name: "PERFECT TRAP",
      text: "PERFECT TRAP When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: goofyGhostHunterEpicI18n,
};
