import type { CharacterCard } from "@tcg/lorcana-types";
import { magicBroomIndustrialModelI18n } from "./188-magic-broom-industrial-model.i18n";

export const magicBroomIndustrialModel: CharacterCard = {
  id: "QlQ",
  canonicalId: "ci_QlQ",
  reprints: ["set2-188"],
  cardType: "character",
  name: "Magic Broom",
  version: "Industrial Model",
  inkType: ["steel"],
  franchise: "Fantasia",
  set: "002",
  cardNumber: 188,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e3b8971a2d4140a79429277295edc4eb",
    tcgPlayer: 527777,
  },
  text: [
    {
      title: "MAKE IT SHINE",
      description:
        "When you play this character, chosen character gains Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 1,
        duration: "until-start-of-next-turn",
      },
      id: "11u-1",
      name: "MAKE IT SHINE",
      text: "MAKE IT SHINE When you play this character, chosen character gains Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: magicBroomIndustrialModelI18n,
};
