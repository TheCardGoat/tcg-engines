/**
 * Token definitions for Lorcana ability text lexer.
 * Defines the vocabulary of keywords, symbols, and literals used in Lorcana card abilities.
 */

import type { TokenType } from "chevrotain";
import { Lexer, createToken } from "chevrotain";

// Keywords - Trigger words
export const When = createToken({ name: "When", pattern: /when/i });
export const Whenever = createToken({ name: "Whenever", pattern: /whenever/i });
export const At = createToken({ name: "At", pattern: /at/i });
export const During = createToken({ name: "During", pattern: /during/i });

// Keywords - Actions
export const Draw = createToken({ name: "Draw", pattern: /draw/i });
export const Discard = createToken({ name: "Discard", pattern: /discard/i });
export const Deal = createToken({ name: "Deal", pattern: /deal/i });
export const Damage = createToken({ name: "Damage", pattern: /damage/i });
export const Gain = createToken({ name: "Gain", pattern: /gain/i });
export const Lose = createToken({ name: "Lose", pattern: /lose/i });
export const Exert = createToken({ name: "Exert", pattern: /exert/i });
export const Ready = createToken({ name: "Ready", pattern: /ready/i });
export const Banish = createToken({ name: "Banish", pattern: /banish/i });
export const Return = createToken({ name: "Return", pattern: /return/i });
export const Play = createToken({ name: "Play", pattern: /play/i });
export const Reveal = createToken({ name: "Reveal", pattern: /reveal/i });
export const Search = createToken({ name: "Search", pattern: /search/i });
export const Look = createToken({ name: "Look", pattern: /look/i });
export const Shuffle = createToken({ name: "Shuffle", pattern: /shuffle/i });
export const Put = createToken({ name: "Put", pattern: /put/i });

// Keywords - Card types
export const Character = createToken({
  name: "Character",
  pattern: /character/i,
});
export const Item = createToken({ name: "Item", pattern: /item/i });
export const Location = createToken({ name: "Location", pattern: /location/i });
export const Card = createToken({ name: "Card", pattern: /card/i });
export const Cards = createToken({ name: "Cards", pattern: /cards/i });

// Keywords - Target modifiers
export const Choose = createToken({ name: "Choose", pattern: /choose/i });
export const Chosen = createToken({ name: "Chosen", pattern: /chosen/i });
export const Your = createToken({ name: "Your", pattern: /your/i });
export const Opponent = createToken({ name: "Opponent", pattern: /opponent/i });
export const Each = createToken({ name: "Each", pattern: /each/i });
export const All = createToken({ name: "All", pattern: /all/i });
export const Another = createToken({ name: "Another", pattern: /another/i });
export const Other = createToken({ name: "Other", pattern: /other/i });
export const This = createToken({ name: "This", pattern: /this/i });

// Keywords - Conditionals
export const If = createToken({ name: "If", pattern: /if/i });
export const May = createToken({ name: "May", pattern: /may/i });
export const Then = createToken({ name: "Then", pattern: /then/i });
export const Or = createToken({ name: "Or", pattern: /or/i });
export const And = createToken({ name: "And", pattern: /and/i });

// Keywords - Zones
export const Hand = createToken({ name: "Hand", pattern: /hand/i });
export const Deck = createToken({ name: "Deck", pattern: /deck/i });
export const Inkwell = createToken({ name: "Inkwell", pattern: /inkwell/i });

// Keywords - Lorcana specific
export const Lore = createToken({ name: "Lore", pattern: /lore/i });
export const Ink = createToken({ name: "Ink", pattern: /ink/i });
export const Quest = createToken({ name: "Quest", pattern: /quest/i });
export const Challenge = createToken({
  name: "Challenge",
  pattern: /challenge/i,
});
export const Strength = createToken({ name: "Strength", pattern: /strength/i });
export const Willpower = createToken({
  name: "Willpower",
  pattern: /willpower/i,
});

// Symbols
export const Comma = createToken({ name: "Comma", pattern: /,/ });
export const Period = createToken({ name: "Period", pattern: /\./ });
export const Plus = createToken({ name: "Plus", pattern: /\+/ });
export const Dash = createToken({ name: "Dash", pattern: /-/ });
export const Colon = createToken({ name: "Colon", pattern: /:/ });
export const Semicolon = createToken({ name: "Semicolon", pattern: /;/ });
export const Apostrophe = createToken({ name: "Apostrophe", pattern: /'/ });
export const LeftParen = createToken({ name: "LeftParen", pattern: /\(/ });
export const RightParen = createToken({ name: "RightParen", pattern: /\)/ });

// Literals
export const NumberToken = createToken({ name: "NumberToken", pattern: /\d+/ });
export const Identifier = createToken({
  name: "Identifier",
  pattern: /[a-zA-Z]+/,
});

// Whitespace (skipped)
export const WhiteSpace = createToken({
  group: Lexer.SKIPPED,
  name: "WhiteSpace",
  pattern: /\s+/,
});

/**
 * Token array in correct order for lexing.
 * Order matters: more specific tokens must come before more general ones.
 * Keywords must come before Identifier to prevent keyword matching as identifiers.
 */
export const allTokens: TokenType[] = [
  WhiteSpace,
  // Keywords (must come before Identifier)
  // Trigger words
  Whenever,
  When,
  At,
  During,
  // Actions
  Draw,
  Discard,
  Deal,
  Damage,
  Gain,
  Lose,
  Exert,
  Ready,
  Banish,
  Return,
  Play,
  Reveal,
  Search,
  Look,
  Shuffle,
  Put,
  // Card types
  Character,
  Item,
  Location,
  // Important: `Cards` must come before `Card` due to Chevrotain's longest-match-first token matching.
  Cards,
  Card,
  // Target modifiers
  Choose,
  Chosen,
  Your,
  Opponent,
  Each,
  All,
  Another,
  Other,
  This,
  // Conditionals
  If,
  May,
  Then,
  Or,
  And,
  // Zones
  Hand,
  Deck,
  Inkwell,
  // Lorcana specific
  Lore,
  Ink,
  Quest,
  Challenge,
  Strength,
  Willpower,
  // Symbols
  Comma,
  Period,
  Plus,
  Dash,
  Colon,
  Semicolon,
  Apostrophe,
  LeftParen,
  RightParen,
  // Literals (must come after keywords)
  NumberToken,
  Identifier,
];
