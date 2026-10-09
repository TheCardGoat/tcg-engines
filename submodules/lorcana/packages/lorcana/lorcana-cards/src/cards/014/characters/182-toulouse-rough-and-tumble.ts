import type { CharacterCard } from "@tcg/lorcana-types";
import { toulouseRoughAndTumbleI18n } from "./182-toulouse-rough-and-tumble.i18n";

export const toulouseRoughAndTumble: CharacterCard = {
  id: "yL5",
  canonicalId: "ci_yL5",
  slug: "lorcana-ci_yL5",
  printings: [
    {
      id: "set14-182",
      artId: "set14-182",
      setCode: "set14",
      collectorNumber: "182",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-182"],
  cardType: "character",
  name: "Toulouse",
  version: "Rough and Tumble",
  inkType: ["steel"],
  franchise: "Aristocats",
  set: "014",
  cardNumber: 182,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7bbd2b04887c4ec997d2b7cf1a5eb72b",
  },
  text: [
    {
      title: "UNBECOMING BEHAVIOR",
      description:
        "When you play this character, opponents can't play actions until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "yL5-1",
      name: "UNBECOMING BEHAVIOR",
      type: "triggered",
      text: "UNBECOMING BEHAVIOR When you play this character, opponents can't play actions until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "restriction",
        restriction: "cant-play-actions",
        target: "OPPONENTS",
        duration: "until-start-of-next-turn",
      },
    },
  ],
  i18n: toulouseRoughAndTumbleI18n,
};
