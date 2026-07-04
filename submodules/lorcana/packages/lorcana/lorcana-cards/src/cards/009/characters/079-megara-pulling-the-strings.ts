import type { CharacterCard } from "@tcg/lorcana-types";
import { megaraPullingTheStringsI18n } from "./079-megara-pulling-the-strings.i18n";

export const megaraPullingTheStrings: CharacterCard = {
  id: "kWU",
  canonicalId: "ci_QjA",
  slug: "lorcana-ci_QjA",
  printings: [
    {
      id: "set9-079",
      artId: "set9-079",
      setCode: "set9",
      collectorNumber: "79",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-087", "set9-079"],
  cardType: "character",
  name: "Megara",
  version: "Pulling the Strings",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "009",
  cardNumber: 79,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bac12540d0734d2080c8cac9d19265d7",
    tcgPlayer: "650019",
  },
  text: [
    {
      title: "WONDER BOY",
      description: "When you play this character, chosen character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "wy2-1",
      name: "WONDER BOY",
      text: "WONDER BOY When you play this character, chosen character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: megaraPullingTheStringsI18n,
};
