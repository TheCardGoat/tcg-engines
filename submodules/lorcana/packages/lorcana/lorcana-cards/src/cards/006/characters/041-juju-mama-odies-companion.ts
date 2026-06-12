import type { CharacterCard } from "@tcg/lorcana-types";
import { jujuMamaOdiesCompanionI18n } from "./041-juju-mama-odies-companion.i18n";

export const jujuMamaOdiesCompanion: CharacterCard = {
  id: "N2e",
  canonicalId: "ci_N2e",
  reprints: ["set6-041"],
  cardType: "character",
  name: "Juju",
  version: "Mama Odie's Companion",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "006",
  cardNumber: 41,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_617dc5c42bf6460da3d61a1f330186bf",
    tcgPlayer: 588154,
  },
  text: [
    {
      title: "BEES' KNEES",
      description:
        "When you play this character, move 1 damage counter from chosen character to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        type: "move-damage",
        amount: 1,
        from: "CHOSEN_CHARACTER",
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
      id: "fzy-1",
      name: "BEES' KNEES",
      text: "BEES' KNEES When you play this character, move 1 damage counter from chosen character to chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: jujuMamaOdiesCompanionI18n,
};
