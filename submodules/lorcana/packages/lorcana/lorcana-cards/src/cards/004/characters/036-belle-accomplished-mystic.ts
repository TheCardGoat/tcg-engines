import type { CharacterCard } from "@tcg/lorcana-types";
import { belleAccomplishedMysticI18n } from "./036-belle-accomplished-mystic.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const belleAccomplishedMystic: CharacterCard = {
  id: "Ybr",
  canonicalId: "ci_CTt",
  reprints: ["set4-036", "set9-040"],
  cardType: "character",
  name: "Belle",
  version: "Accomplished Mystic",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 36,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c51b6a26015b45f298d1664787f37234",
    tcgPlayer: 651121,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "ENHANCED HEALING",
      description:
        "When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Sorcerer"],
  abilities: [
    shift(3),
    {
      id: "Ybr-2",
      name: "ENHANCED HEALING",
      text: "ENHANCED HEALING When you play this character, move up to 3 damage counters from chosen character to chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: { type: "up-to", value: 3 },
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: belleAccomplishedMysticI18n,
};
