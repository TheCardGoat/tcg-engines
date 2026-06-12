import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaSeaWitchI18n } from "./059-ursula-sea-witch.i18n";

export const ursulaSeaWitch: CharacterCard = {
  id: "14O",
  canonicalId: "ci_1J4",
  reprints: ["set3-059", "set9-037"],
  cardType: "character",
  name: "Ursula",
  version: "Sea Witch",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "003",
  cardNumber: 59,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_48ccbae93afd4032a54bf09f03f6a0c2",
    tcgPlayer: 650145,
  },
  text: [
    {
      title: "YOU'RE TOO LATE",
      description:
        "Whenever this character quests, chosen opposing character can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "14O-1",
      name: "YOU'RE TOO LATE",
      text: "YOU'RE TOO LATE Whenever this character quests, chosen opposing character can't ready at the start of their next turn.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        duration: "their-next-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: ursulaSeaWitchI18n,
};
