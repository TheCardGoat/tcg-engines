import { describe, expect, it } from "bun:test";
import {
  matchKeywordAtStart,
  stripLeadingKeywords,
  stripTrailingKeywords,
} from "../utils/keyword-dictionary";

describe("matchKeywordAtStart", () => {
  describe("simple keywords", () => {
    it("matches EN Evasive", () => {
      const match = matchKeywordAtStart("Evasive DISAPPEAR When you play...", "en");
      expect(match).toEqual({ text: "Evasive", length: 7 });
    });

    it("matches DE Wendig", () => {
      const match = matchKeywordAtStart("Wendig VERSCHWINDEN Wenn du...", "de");
      expect(match).toEqual({ text: "Wendig", length: 6 });
    });

    it("matches FR Insaisissable", () => {
      const match = matchKeywordAtStart("Insaisissable TU DISPARAIS Lorsque...", "fr");
      expect(match).toEqual({ text: "Insaisissable", length: 13 });
    });

    it("matches DE Rasant (Rush)", () => {
      const match = matchKeywordAtStart("Rasant Herausfordern +3 Wendig", "de");
      expect(match).toEqual({ text: "Rasant", length: 6 });
    });

    it("rejects ALL-CAPS keyword match (ability name, not keyword)", () => {
      const match = matchKeywordAtStart("VERSCHWINDEN Wenn du diesen...", "de");
      expect(match).toBeNull();
    });

    it("rejects ALL-CAPS EVASIVE (ability name, not keyword)", () => {
      const match = matchKeywordAtStart("EVASIVE Some effect text", "en");
      expect(match).toBeNull();
    });

    it("matches keyword at end of text", () => {
      const match = matchKeywordAtStart("Wendig", "de");
      expect(match).toEqual({ text: "Wendig", length: 6 });
    });

    it("returns null when text does not start with a keyword", () => {
      const match = matchKeywordAtStart("BÖSES LÄCHELN Draw a card.", "de");
      expect(match).toBeNull();
    });
  });

  describe("parameterized keywords", () => {
    it("matches DE Herausfordern +3", () => {
      const match = matchKeywordAtStart("Herausfordern +3 Wendig", "de");
      expect(match).toEqual({ text: "Herausfordern +3", length: 16 });
    });

    it("matches FR Offensif +1", () => {
      const match = matchKeywordAtStart("Offensif +1 Insaisissable", "fr");
      expect(match).toEqual({ text: "Offensif +1", length: 11 });
    });

    it("matches IT Resistere +2", () => {
      const match = matchKeywordAtStart("Resistere +2", "it");
      expect(match).toEqual({ text: "Resistere +2", length: 12 });
    });
  });

  describe("complex keywords", () => {
    it("matches DE Gestaltwandel 5", () => {
      const match = matchKeywordAtStart("Gestaltwandel 5 Wendig BÖSES LÄCHELN...", "de");
      expect(match).toEqual({ text: "Gestaltwandel 5", length: 15 });
    });

    it("matches FR Alter 6", () => {
      const match = matchKeywordAtStart("Alter 6 Insaisissable POUVOIR...", "fr");
      expect(match).toEqual({ text: "Alter 6", length: 7 });
    });

    it("matches IT Trasformazione 4", () => {
      const match = matchKeywordAtStart("Trasformazione 4 Sfuggente", "it");
      expect(match).toEqual({ text: "Trasformazione 4", length: 16 });
    });

    it("matches EN Shift 2", () => {
      const match = matchKeywordAtStart("Shift 2 Evasive UNDERSEA ADVENTURE", "en");
      expect(match).toEqual({ text: "Shift 2", length: 7 });
    });
  });
});

describe("stripLeadingKeywords", () => {
  it("strips single keyword from DE text", () => {
    const result = stripLeadingKeywords(
      "Wendig VERSCHWINDEN Wenn du diesen Charakter ausspielst...",
      "de",
      1,
    );

    expect(result.keywords).toEqual([{ title: "Wendig" }]);
    expect(result.remainder).toBe("VERSCHWINDEN Wenn du diesen Charakter ausspielst...");
  });

  it("strips multiple keywords from DE text", () => {
    const result = stripLeadingKeywords("Rasant Herausfordern +3 Wendig", "de", 10);

    expect(result.keywords).toEqual([
      { title: "Rasant" },
      { title: "Herausfordern +3" },
      { title: "Wendig" },
    ]);
    expect(result.remainder).toBe("");
  });

  it("strips Shift + Evasive from FR text", () => {
    const result = stripLeadingKeywords(
      "Alter 5 Insaisissable SOURIRE MALICIEUX {E} — Piochez 1 carte.",
      "fr",
      2,
    );

    expect(result.keywords).toEqual([{ title: "Alter 5" }, { title: "Insaisissable" }]);
    expect(result.remainder).toBe("SOURIRE MALICIEUX {E} — Piochez 1 carte.");
  });

  it("respects expectedKeywordCount limit", () => {
    const result = stripLeadingKeywords("Rasant Herausfordern +3 Wendig", "de", 1);

    expect(result.keywords).toEqual([{ title: "Rasant" }]);
    expect(result.remainder).toBe("Herausfordern +3 Wendig");
  });

  it("stops at ALL-CAPS ability name", () => {
    const result = stripLeadingKeywords("Wendig VERSCHWINDEN Wenn du diesen...", "de", 10);

    expect(result.keywords).toEqual([{ title: "Wendig" }]);
    expect(result.remainder).toBe("VERSCHWINDEN Wenn du diesen...");
  });

  it("returns empty keywords when text starts with ability name", () => {
    const result = stripLeadingKeywords("BÖSES LÄCHELN Draw a card.", "de", 10);

    expect(result.keywords).toEqual([]);
    expect(result.remainder).toBe("BÖSES LÄCHELN Draw a card.");
  });

  it("skips parenthetical reminder text after a keyword", () => {
    const result = stripLeadingKeywords(
      "Shift 5 (You may pay 5 to play this on top of one of your characters named Cheshire Cat.) Evasive WICKED SMILE — Banish chosen damaged character.",
      "en",
      2,
    );

    expect(result.keywords).toEqual([{ title: "Shift 5" }, { title: "Evasive" }]);
    expect(result.remainder).toBe("WICKED SMILE — Banish chosen damaged character.");
  });

  it("skips reminder text for parameterized keywords", () => {
    const result = stripLeadingKeywords(
      "Herausfordern +3 (Während dieser Charakter herausfordert, erhält er +3.) Wendig",
      "de",
      2,
    );

    expect(result.keywords).toEqual([{ title: "Herausfordern +3" }, { title: "Wendig" }]);
    expect(result.remainder).toBe("");
  });
});

describe("stripTrailingKeywords", () => {
  it("strips trailing Singer keyword from DE text", () => {
    const result = stripTrailingKeywords(
      "UNDERDOG Falls dies dein erster Zug ist... Singen 3",
      "de",
      1,
    );

    expect(result.trailingKeywords).toEqual([{ title: "Singen 3" }]);
    expect(result.textBeforeTrailing).toBe("UNDERDOG Falls dies dein erster Zug ist...");
  });

  it("strips trailing Evasive from FR text", () => {
    const result = stripTrailingKeywords("SHOWIN' UP Some effect text. Insaisissable", "fr", 1);

    expect(result.trailingKeywords).toEqual([{ title: "Insaisissable" }]);
    expect(result.textBeforeTrailing).toBe("SHOWIN' UP Some effect text.");
  });

  it("strips trailing keyword with reminder text", () => {
    const result = stripTrailingKeywords(
      "UNDERDOG effect text. Singen 3 (Die Kosten dieses Charakters gelten als 3.)",
      "de",
      1,
    );

    expect(result.trailingKeywords).toEqual([{ title: "Singen 3" }]);
    expect(result.textBeforeTrailing).toBe("UNDERDOG effect text.");
  });

  it("returns empty when no trailing keywords found", () => {
    const result = stripTrailingKeywords("SOME ABILITY effect text.", "de", 1);

    expect(result.trailingKeywords).toEqual([]);
    expect(result.textBeforeTrailing).toBe("SOME ABILITY effect text.");
  });
});
