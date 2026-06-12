// Canonical print-n-play SEED Aggro starter list for the Gundam Card Game.
// Mirrors the structured `seedAggro` fixture used by the mounted simulator so
// the import path (matchmaking -> quick-match -> adapter) and the in-simulator
// local-play path stay aligned.
//
// Format: two sections (Main Deck 50, Resource Deck 10) — the same shape the
// deck-text parser in @tcg/api-core/modules/play/services/deck-text-parser
// accepts for cyberpunk's Arasaka starter, so a single text-import pipeline
// can route to either game.
export const seedAggroPrintNPlayDeckList = `
SEED Aggro Print and Play Deck

Main Deck (50)
4 ST04-002 Strike Gundam
4 ST04-003 Moebius Zero
4 ST04-004 Moebius
4 ST04-005 Strike Dagger
4 ST04-007 Aegis Gundam (MA Mode)
4 ST04-008 Ginn
4 ST04-009 Miguel's Ginn
4 ST04-010 Kira Yamato
4 ST04-011 Athrun Zala
4 ST04-012 Striker Pack
4 ST04-013 Hawk of Endymion
4 ST04-014 The Magic Bullet of Dusk
2 ST04-015 Archangel

Resource Deck (10)
10 R-001 Resource
`;
