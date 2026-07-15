import type { DeckList } from "@tcg/gundam-engine";

/**
 * Built from the ST01 Earth Federation starter set. Uses every card
 * the set provides at 4-of (or 2-of for the White Base base card,
 * which is the only way to hit exactly 50 from ST01 alone).
 *
 * Cost curve skews low — lots of 1/2-cost units — so the deck reliably
 * puts threats on the board by turn 2 even against a bot with no
 * tempo priors.
 */
export const earthFederationStarter: DeckList = {
  name: "Earth Federation Starter",
  description: "ST01-only starter built around Amuro, Guncannon, and White Base.",
  cards: [
    { cardNumber: "ST01-005", count: 4 }, // GM (cost 1)
    { cardNumber: "ST01-008", count: 4 }, // Demi Trainer (cost 1)
    { cardNumber: "ST01-003", count: 4 }, // Guncannon (cost 2)
    { cardNumber: "ST01-004", count: 4 }, // Guntank (cost 2)
    { cardNumber: "ST01-007", count: 4 }, // Gundam Aerial Bit on Form (cost 2)
    { cardNumber: "ST01-009", count: 4 }, // Zowort (cost 2)
    { cardNumber: "ST01-002", count: 4 }, // Gundam MA Form (cost 3)
    { cardNumber: "ST01-010", count: 4 }, // Amuro Ray (pilot)
    { cardNumber: "ST01-011", count: 4 }, // Suletta Mercury (pilot)
    { cardNumber: "ST01-012", count: 4 }, // Thoroughly Damaged (command)
    { cardNumber: "ST01-013", count: 4 }, // Kai's Resolve (command)
    { cardNumber: "ST01-014", count: 4 }, // Unforeseen Incident (command)
    { cardNumber: "ST01-015", count: 2 }, // White Base (base)
  ],
  resource: { cardNumber: "R-001", count: 10 },
};
