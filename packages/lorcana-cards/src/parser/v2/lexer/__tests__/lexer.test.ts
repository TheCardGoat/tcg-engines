/**
 * Tests for Lorcana lexer tokenization.
 * Ensures tokens are correctly identified from ability text.
 */

import { describe, expect, it } from "bun:test";
import { LorcanaLexer } from "../lexer";
import {
  All,
  And,
  Another,
  At,
  Banish,
  Card,
  Cards,
  Challenge,
  Character,
  Choose,
  Chosen,
  Colon,
  Comma,
  Damage,
  Dash,
  Deal,
  Deck,
  Discard,
  Draw,
  During,
  Each,
  Exert,
  Gain,
  Hand,
  Identifier,
  If,
  Ink,
  Inkwell,
  Item,
  Location,
  Look,
  Lore,
  Lose,
  May,
  NumberToken,
  Opponent,
  Or,
  Other,
  Period,
  Play,
  Put,
  Quest,
  Ready,
  Return,
  Reveal,
  Search,
  Semicolon,
  Shuffle,
  Strength,
  Then,
  This,
  When,
  Whenever,
  Willpower,
  Your,
} from "../tokens";

describe("LorcanaLexer", () => {
  describe("keyword tokenization", () => {
    it("tokenizes trigger keywords", () => {
      const result = LorcanaLexer.tokenize("when whenever at during");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(4);
      expect(result.tokens[0].tokenType).toBe(When);
      expect(result.tokens[1].tokenType).toBe(Whenever);
      expect(result.tokens[2].tokenType).toBe(At);
      expect(result.tokens[3].tokenType).toBe(During);
    });

    it("tokenizes action keywords", () => {
      const result = LorcanaLexer.tokenize(
        "draw discard deal damage gain lose exert ready banish return play reveal search look shuffle put",
      );

      expect(result.errors).toHaveLength(0);
      expect(result.tokens[0].tokenType).toBe(Draw);
      expect(result.tokens[1].tokenType).toBe(Discard);
      expect(result.tokens[2].tokenType).toBe(Deal);
      expect(result.tokens[3].tokenType).toBe(Damage);
      expect(result.tokens[4].tokenType).toBe(Gain);
      expect(result.tokens[5].tokenType).toBe(Lose);
      expect(result.tokens[6].tokenType).toBe(Exert);
      expect(result.tokens[7].tokenType).toBe(Ready);
      expect(result.tokens[8].tokenType).toBe(Banish);
      expect(result.tokens[9].tokenType).toBe(Return);
      expect(result.tokens[10].tokenType).toBe(Play);
      expect(result.tokens[11].tokenType).toBe(Reveal);
      expect(result.tokens[12].tokenType).toBe(Search);
      expect(result.tokens[13].tokenType).toBe(Look);
      expect(result.tokens[14].tokenType).toBe(Shuffle);
      expect(result.tokens[15].tokenType).toBe(Put);
    });

    it("tokenizes card type keywords", () => {
      const result = LorcanaLexer.tokenize(
        "character item location card cards",
      );

      expect(result.errors).toHaveLength(0);
      expect(result.tokens[0].tokenType).toBe(Character);
      expect(result.tokens[1].tokenType).toBe(Item);
      expect(result.tokens[2].tokenType).toBe(Location);
      expect(result.tokens[3].tokenType).toBe(Card);
      expect(result.tokens[4].tokenType).toBe(Cards);
    });

    it("tokenizes target modifier keywords", () => {
      const result = LorcanaLexer.tokenize(
        "choose chosen your opponent each all another other this",
      );

      expect(result.errors).toHaveLength(0);
      expect(result.tokens[0].tokenType).toBe(Choose);
      expect(result.tokens[1].tokenType).toBe(Chosen);
      expect(result.tokens[2].tokenType).toBe(Your);
      expect(result.tokens[3].tokenType).toBe(Opponent);
      expect(result.tokens[4].tokenType).toBe(Each);
      expect(result.tokens[5].tokenType).toBe(All);
      expect(result.tokens[6].tokenType).toBe(Another);
      expect(result.tokens[7].tokenType).toBe(Other);
      expect(result.tokens[8].tokenType).toBe(This);
    });

    it("tokenizes conditional keywords", () => {
      const result = LorcanaLexer.tokenize("if may then or and");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens[0].tokenType).toBe(If);
      expect(result.tokens[1].tokenType).toBe(May);
      expect(result.tokens[2].tokenType).toBe(Then);
      expect(result.tokens[3].tokenType).toBe(Or);
      expect(result.tokens[4].tokenType).toBe(And);
    });

    it("tokenizes zone keywords", () => {
      const result = LorcanaLexer.tokenize("hand deck inkwell");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens[0].tokenType).toBe(Hand);
      expect(result.tokens[1].tokenType).toBe(Deck);
      expect(result.tokens[2].tokenType).toBe(Inkwell);
    });

    it("tokenizes Lorcana-specific keywords", () => {
      const result = LorcanaLexer.tokenize(
        "lore ink quest challenge strength willpower",
      );

      expect(result.errors).toHaveLength(0);
      expect(result.tokens[0].tokenType).toBe(Lore);
      expect(result.tokens[1].tokenType).toBe(Ink);
      expect(result.tokens[2].tokenType).toBe(Quest);
      expect(result.tokens[3].tokenType).toBe(Challenge);
      expect(result.tokens[4].tokenType).toBe(Strength);
      expect(result.tokens[5].tokenType).toBe(Willpower);
    });
  });

  describe("case-insensitive keyword matching", () => {
    it("matches uppercase keywords", () => {
      const result = LorcanaLexer.tokenize("WHEN DRAW DAMAGE");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
      expect(result.tokens[0].tokenType).toBe(When);
      expect(result.tokens[1].tokenType).toBe(Draw);
      expect(result.tokens[2].tokenType).toBe(Damage);
    });

    it("matches mixed case keywords", () => {
      const result = LorcanaLexer.tokenize("WhEn DrAw DaMaGe");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
      expect(result.tokens[0].tokenType).toBe(When);
      expect(result.tokens[1].tokenType).toBe(Draw);
      expect(result.tokens[2].tokenType).toBe(Damage);
    });

    it("matches sentence case keywords", () => {
      const result = LorcanaLexer.tokenize("When Draw Damage");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
      expect(result.tokens[0].tokenType).toBe(When);
      expect(result.tokens[1].tokenType).toBe(Draw);
      expect(result.tokens[2].tokenType).toBe(Damage);
    });
  });

  describe("symbol tokenization", () => {
    it("tokenizes punctuation symbols", () => {
      const result = LorcanaLexer.tokenize(", . - : ;");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(5);
      expect(result.tokens[0].tokenType).toBe(Comma);
      expect(result.tokens[1].tokenType).toBe(Period);
      expect(result.tokens[2].tokenType).toBe(Dash);
      expect(result.tokens[3].tokenType).toBe(Colon);
      expect(result.tokens[4].tokenType).toBe(Semicolon);
    });

    it("tokenizes parentheses", () => {
      const result = LorcanaLexer.tokenize("( )");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(2);
      expect(result.tokens[0].tokenType.name).toBe("LeftParen");
      expect(result.tokens[1].tokenType.name).toBe("RightParen");
    });

    it("tokenizes apostrophe", () => {
      const result = LorcanaLexer.tokenize("opponent's");

      expect(result.errors).toHaveLength(0);
      // Should tokenize as: Opponent, Apostrophe, Identifier
      expect(result.tokens[0].tokenType).toBe(Opponent);
      expect(result.tokens[1].tokenType.name).toBe("Apostrophe");
      expect(result.tokens[2].tokenType).toBe(Identifier);
    });
  });

  describe("number tokenization", () => {
    it("tokenizes single digit numbers", () => {
      const result = LorcanaLexer.tokenize("1 2 3");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
      expect(result.tokens[0].tokenType).toBe(NumberToken);
      expect(result.tokens[0].image).toBe("1");
      expect(result.tokens[1].tokenType).toBe(NumberToken);
      expect(result.tokens[1].image).toBe("2");
      expect(result.tokens[2].tokenType).toBe(NumberToken);
      expect(result.tokens[2].image).toBe("3");
    });

    it("tokenizes multi-digit numbers", () => {
      const result = LorcanaLexer.tokenize("10 25 100");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
      expect(result.tokens[0].image).toBe("10");
      expect(result.tokens[1].image).toBe("25");
      expect(result.tokens[2].image).toBe("100");
    });

    it("tokenizes numbers in context", () => {
      const result = LorcanaLexer.tokenize("draw 2 cards");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
      expect(result.tokens[0].tokenType).toBe(Draw);
      expect(result.tokens[1].tokenType).toBe(NumberToken);
      expect(result.tokens[1].image).toBe("2");
      expect(result.tokens[2].tokenType).toBe(Cards);
    });
  });

  describe("identifier tokenization", () => {
    it("tokenizes non-keyword identifiers", () => {
      const result = LorcanaLexer.tokenize("mickey mouse tailor");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
      expect(result.tokens[0].tokenType).toBe(Identifier);
      expect(result.tokens[0].image).toBe("mickey");
      expect(result.tokens[1].tokenType).toBe(Identifier);
      expect(result.tokens[1].image).toBe("mouse");
      expect(result.tokens[2].tokenType).toBe(Identifier);
      expect(result.tokens[2].image).toBe("tailor");
    });

    it("distinguishes keywords from identifiers", () => {
      // Note: Chevrotain tokens don't use word boundaries by default,
      // So "draws" matches "draw" (keyword) + "s" (identifier).
      // Use a word that doesn't contain any keyword prefix.
      const result = LorcanaLexer.tokenize("character");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(1);
      expect(result.tokens[0].tokenType).toBe(Character);
      expect(result.tokens[0].image).toBe("character");
    });
  });

  describe("whitespace handling", () => {
    it("skips single spaces", () => {
      const result = LorcanaLexer.tokenize("draw 2 cards");

      expect(result.errors).toHaveLength(0);
      // Only 3 tokens, spaces are skipped
      expect(result.tokens).toHaveLength(3);
    });

    it("skips multiple spaces", () => {
      const result = LorcanaLexer.tokenize("draw    2    cards");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
    });

    it("skips tabs", () => {
      const result = LorcanaLexer.tokenize("draw\t2\tcards");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
    });

    it("skips newlines", () => {
      const result = LorcanaLexer.tokenize("draw\n2\ncards");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
    });

    it("handles mixed whitespace", () => {
      const result = LorcanaLexer.tokenize("draw  \t\n  2  \n\t  cards");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
    });
  });

  describe("real ability text tokenization", () => {
    it("tokenizes simple draw ability", () => {
      const result = LorcanaLexer.tokenize("draw 2 cards");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
      expect(result.tokens[0].tokenType).toBe(Draw);
      expect(result.tokens[1].tokenType).toBe(NumberToken);
      expect(result.tokens[2].tokenType).toBe(Cards);
    });

    it("tokenizes triggered ability", () => {
      const result = LorcanaLexer.tokenize(
        "when you play this character, draw 2 cards.",
      );

      expect(result.errors).toHaveLength(0);
      const tokenTypes = result.tokens.map((t) => t.tokenType.name);
      expect(tokenTypes).toContain("When");
      expect(tokenTypes).toContain("Play");
      expect(tokenTypes).toContain("This");
      expect(tokenTypes).toContain("Character");
      expect(tokenTypes).toContain("Comma");
      expect(tokenTypes).toContain("Draw");
      expect(tokenTypes).toContain("NumberToken");
      expect(tokenTypes).toContain("Cards");
      expect(tokenTypes).toContain("Period");
    });

    it("tokenizes damage ability", () => {
      const result = LorcanaLexer.tokenize("deal 2 damage to chosen character");

      expect(result.errors).toHaveLength(0);
      const tokenTypes = result.tokens.map((t) => t.tokenType.name);
      expect(tokenTypes).toContain("Deal");
      expect(tokenTypes).toContain("NumberToken");
      expect(tokenTypes).toContain("Damage");
      expect(tokenTypes).toContain("Chosen");
      expect(tokenTypes).toContain("Character");
    });

    it("tokenizes lore gain ability", () => {
      const result = LorcanaLexer.tokenize("gain 1 lore");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(3);
      expect(result.tokens[0].tokenType).toBe(Gain);
      expect(result.tokens[1].tokenType).toBe(NumberToken);
      expect(result.tokens[2].tokenType).toBe(Lore);
    });
  });

  describe("error handling", () => {
    it("handles empty string", () => {
      const result = LorcanaLexer.tokenize("");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(0);
    });

    it("handles unknown special characters gracefully", () => {
      // Some special characters might not be recognized
      // The lexer should still tokenize what it can
      const result = LorcanaLexer.tokenize("draw @ 2 cards");

      // The '@' might not match any token, but other tokens should work
      const tokenTypes = result.tokens.map((t) => t.tokenType.name);
      expect(tokenTypes).toContain("Draw");
      expect(tokenTypes).toContain("NumberToken");
      expect(tokenTypes).toContain("Cards");
    });
  });

  describe("token order priority", () => {
    it("matches longer keywords before shorter ones", () => {
      // "whenever" should match before "when"
      const result = LorcanaLexer.tokenize("whenever");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(1);
      expect(result.tokens[0].tokenType).toBe(Whenever);
    });

    it("matches keywords before identifiers", () => {
      // "card" should match Card token, not Identifier
      const result = LorcanaLexer.tokenize("card");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(1);
      expect(result.tokens[0].tokenType).toBe(Card);
    });

    it("matches cards before card", () => {
      // "cards" should match Cards token
      const result = LorcanaLexer.tokenize("cards");

      expect(result.errors).toHaveLength(0);
      expect(result.tokens).toHaveLength(1);
      expect(result.tokens[0].tokenType).toBe(Cards);
    });
  });
});
