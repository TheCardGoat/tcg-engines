import type { DeckList } from "@tcg/gundam-engine";

/**
 * Built from the ST04 Gundam SEED starter set (Strike / Aegis /
 * Ginn). Uses every ST04 card at 4-of (plus 2 Archangel bases to hit
 * 50). Aggressive curve — 8 one-cost units plus cheap commands let
 * the bot and human both close out games reasonably fast, which keeps
 * vs-AI sessions snappy.
 */
export const seedAggro: DeckList = {
  name: "SEED Aggro",
  description: "ST04-only aggro deck with Strike Gundam, Aegis, and Kira/Athrun pilots.",
  cards: [
    { cardNumber: "ST04-004", count: 4 }, // Moebius (cost 1)
    { cardNumber: "ST04-008", count: 4 }, // Ginn (cost 1)
    { cardNumber: "ST04-002", count: 4 }, // Strike Gundam (cost 2)
    { cardNumber: "ST04-003", count: 4 }, // Moebius Zero (cost 2)
    { cardNumber: "ST04-005", count: 4 }, // Strike Dagger (cost 2)
    { cardNumber: "ST04-009", count: 4 }, // Miguel's Ginn (cost 2)
    { cardNumber: "ST04-007", count: 4 }, // Aegis Gundam MA Mode (cost 3)
    { cardNumber: "ST04-010", count: 4 }, // Kira Yamato (pilot)
    { cardNumber: "ST04-011", count: 4 }, // Athrun Zala (pilot)
    { cardNumber: "ST04-012", count: 4 }, // Striker Pack (command)
    { cardNumber: "ST04-013", count: 4 }, // Hawk of Endymion (command)
    { cardNumber: "ST04-014", count: 4 }, // The Magic Bullet of Dusk (command)
    { cardNumber: "ST04-015", count: 2 }, // Archangel (base)
  ],
  resource: { cardNumber: "R-001", count: 10 },
};
