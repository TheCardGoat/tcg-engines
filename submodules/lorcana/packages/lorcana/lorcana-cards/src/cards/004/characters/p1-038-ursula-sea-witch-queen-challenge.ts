import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaSeaWitchQueenP1ChallengeI18n } from "./p1-038-ursula-sea-witch-queen-challenge.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const ursulaSeaWitchQueenP1Challenge: CharacterCard = {
  id: "sX5",
  canonicalId: "ci_CCz",
  slug: "lorcana-ci_CCz",
  printings: [
    {
      id: "set4-p1-038-challenge",
      artId: "ci_CCz-challenge",
      setCode: "set4",
      collectorNumber: "38",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set4-058"],
  cardType: "character",
  name: "Ursula",
  version: "Sea Witch Queen",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 38,
  rarity: "special",
  specialRarity: "challenge",
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_68c45595c25041f3bcf2073a5b533edd",
    tcgPlayer: "550844",
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "NOW",
      description: "I AM THE RULER! Whenever this character quests, exert chosen character.",
    },
    {
      title: "YOU'LL LISTEN TO ME!",
      description: "Other characters can't exert to sing songs.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
  abilities: [
    shift(5),
    {
      id: "KAb-2",
      name: "NOW I AM THE RULER!",
      text: "NOW I AM THE RULER! Whenever this character quests, exert chosen character.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
    {
      id: "KAb-3",
      name: "YOU'LL LISTEN TO ME!",
      text: "YOU'LL LISTEN TO ME! Other characters can't exert to sing songs.",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
      },
    },
  ],
  i18n: ursulaSeaWitchQueenP1ChallengeI18n,
};
