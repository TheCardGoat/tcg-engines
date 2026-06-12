import type { CharacterCard } from "@tcg/lorcana-types";
import { marshmallowCrankyClimberI18n } from "./053-marshmallow-cranky-climber.i18n";

export const marshmallowCrankyClimber: CharacterCard = {
  id: "oie",
  canonicalId: "ci_oie",
  reprints: ["set11-053"],
  cardType: "character",
  name: "Marshmallow",
  version: "Cranky Climber",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "011",
  cardNumber: 53,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f000a1651ff54227806f5da0c5d89c42",
    tcgPlayer: 675281,
  },
  text: [
    {
      title: "ICY BLAST",
      description:
        "Whenever this character quests, each opponent can't ready more than 1 of their characters at the start of their next turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "1su-1",
      effect: {
        restriction: "ready-only-one-character",
        target: "OPPONENTS",
        type: "restriction",
        duration: "their-next-turn",
      },
      name: "ICY BLAST",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      text: "ICY BLAST Whenever this character quests, each opponent can't ready more than 1 of their characters at the start of their next turn.",
    },
  ],
  i18n: marshmallowCrankyClimberI18n,
};
