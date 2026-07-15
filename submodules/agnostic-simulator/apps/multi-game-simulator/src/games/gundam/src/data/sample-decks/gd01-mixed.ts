import type { DeckList } from "@tcg/gundam-engine";

/**
 * GD01 booster-only build. Higher curve than the ST01/ST04 starter
 * decks — cost-4 Unicorn top-end — so matches go longer and surface
 * more late-game interactions for the bot to navigate.
 */
export const gd01Mixed: DeckList = {
  name: "GD01 Mixed",
  description: "GD01 booster deck with Unicorn Gundam, Delta Plus, and Banagher.",
  cards: [
    { cardNumber: "GD01-008", count: 4 }, // Guntank (cost 1)
    { cardNumber: "GD01-004", count: 4 }, // Guncannon (cost 2)
    { cardNumber: "GD01-009", count: 4 }, // G-Fighter (cost 2)
    { cardNumber: "GD01-011", count: 4 }, // Loto (cost 2)
    { cardNumber: "GD01-013", count: 4 }, // Gundam (cost 2)
    { cardNumber: "GD01-006", count: 4 }, // Delta Plus (cost 3)
    { cardNumber: "GD01-005", count: 4 }, // Unicorn Gundam Unicorn Mode (cost 4)
    { cardNumber: "GD01-087", count: 4 }, // Sayla Mass (pilot)
    { cardNumber: "GD01-088", count: 4 }, // Banagher Links (pilot)
    { cardNumber: "GD01-090", count: 4 }, // Duo Maxwell (pilot)
    { cardNumber: "GD01-099", count: 4 }, // Intercept Orders (command)
    { cardNumber: "GD01-101", count: 4 }, // Deep Devotion (command)
    { cardNumber: "GD01-123", count: 2 }, // Nahel Argama (base)
  ],
  resource: { cardNumber: "R-001", count: 10 },
};
