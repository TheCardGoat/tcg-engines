import type { CharacterCard } from "@tcg/lorcana-types";
import { belleUntrainedMysticI18n } from "./037-belle-untrained-mystic.i18n";

export const belleUntrainedMystic: CharacterCard = {
  id: "1Mo",
  canonicalId: "ci_b5v",
  reprints: ["set4-037", "set9-039"],
  cardType: "character",
  name: "Belle",
  version: "Untrained Mystic",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 37,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_53d3d0830c344ef08b076c3aada0afa6",
    tcgPlayer: 649986,
  },
  text: [
    {
      title: "HERE NOW, DON'T DO THAT",
      description:
        "When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "161-1",
      name: "HERE NOW, DON'T DO THAT",
      text: "HERE NOW, DON'T DO THAT When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.",
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
          amount: { type: "up-to", value: 1 },
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
  i18n: belleUntrainedMysticI18n,
};
