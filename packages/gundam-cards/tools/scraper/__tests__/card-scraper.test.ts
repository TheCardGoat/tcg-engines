/**
 * Tests for Card Scraper
 */

import { describe, expect, it } from "bun:test";
import { parseCardHTML } from "../card-scraper";

describe("Card Scraper", () => {
  describe("parseCardHTML", () => {
    it("should parse valid card HTML", () => {
      const html = `
        <div class="cardNo">ST01-001</div>
        <div class="rarity">LR</div>
        <h1 class="cardName">RX-78-2 Gundam</h1>
        <div class="cardImage"><img src="https://example.com/card.jpg"></div>
        <dl class="dataBox"><dt class="dataTit">Lv.</dt><dd class="dataTxt">3</dd></dl>
        <dl class="dataBox"><dt class="dataTit">COST</dt><dd class="dataTxt">2</dd></dl>
        <dl class="dataBox"><dt class="dataTit">COLOR</dt><dd class="dataTxt">Blue</dd></dl>
        <dl class="dataBox"><dt class="dataTit">TYPE</dt><dd class="dataTxt">UNIT</dd></dl>
        <dl class="dataBox"><dt class="dataTit">Zone</dt><dd class="dataTxt">Space Earth</dd></dl>
        <dl class="dataBox"><dt class="dataTit">Trait</dt><dd class="dataTxt">(Earth Federation)</dd></dl>
        <dl class="dataBox"><dt class="dataTit">Link</dt><dd class="dataTxt">[Amuro Ray]</dd></dl>
        <dl class="dataBox"><dt class="dataTit">AP</dt><dd class="dataTxt">5</dd></dl>
        <dl class="dataBox"><dt class="dataTit">HP</dt><dd class="dataTxt">6</dd></dl>
        <dl class="dataBox"><dt class="dataTit">Source Title</dt><dd class="dataTxt">Mobile Suit Gundam</dd></dl>
        <div class="cardDataRow overview">
          <div class="dataTxt isRegular">
            &lt;First Strike&gt;<br>【Deploy】Search your deck for a Pilot card named "Amuro Ray".
          </div>
        </div>
      `;

      const result = parseCardHTML(html);

      expect(result).toBeDefined();
      expect(result?.cardNumber).toBe("ST01-001");
      expect(result?.name).toBe("RX-78-2 Gundam");
      expect(result?.rarity).toBe("LR");
      expect(result?.cardType).toBe("UNIT");
      expect(result?.level).toBe("3");
      expect(result?.cost).toBe("2");
      expect(result?.color).toBe("Blue");
      expect(result?.ap).toBe("5");
      expect(result?.hp).toBe("6");
      expect(result?.zone).toBe("Space Earth");
      expect(result?.trait).toBe("(Earth Federation)");
      expect(result?.link).toBe("[Amuro Ray]");
      expect(result?.effectText).toContain("<First Strike>");
      expect(result?.effectText).toContain("Deploy");
      expect(result?.effectText).toContain("\n");
      expect(result?.effectText).not.toContain("&lt;");
      expect(result?.effectText).not.toContain("&gt;");
      expect(result?.effectText).not.toContain("<br");
    });

    it("should return null for invalid HTML", () => {
      const html = "<html><body>Invalid page</body></html>";
      const result = parseCardHTML(html);
      expect(result).toBeNull();
    });

    it("should return null for homepage HTML", () => {
      const html = `
        <html>
          <body>
            <div>LEARN TO PLAY</div>
            <img src="/en/images/common/logo.png">
          </body>
        </html>
      `;
      const result = parseCardHTML(html);
      expect(result).toBeNull();
    });

    it("should handle different br tag formats and HTML entities", () => {
      const html = `
        <div class="cardNo">GD01-001</div>
        <div class="rarity">LR</div>
        <h1 class="cardName">Gundam</h1>
        <div class="cardImage"><img src="../images/cards/card/GD01-001.webp"></div>
        <dl class="dataBox"><dt class="dataTit">Lv.</dt><dd class="dataTxt">4</dd></dl>
        <dl class="dataBox"><dt class="dataTit">COST</dt><dd class="dataTxt">3</dd></dl>
        <dl class="dataBox"><dt class="dataTit">COLOR</dt><dd class="dataTxt">Blue</dd></dl>
        <dl class="dataBox"><dt class="dataTit">TYPE</dt><dd class="dataTxt">UNIT</dd></dl>
        <dl class="dataBox"><dt class="dataTit">AP</dt><dd class="dataTxt">3</dd></dl>
        <dl class="dataBox"><dt class="dataTit">HP</dt><dd class="dataTxt">3</dd></dl>
        <div class="cardDataRow overview">
          <div class="dataTxt isRegular">
            All your (White Base Team) Units gain &lt;Repair 1&gt;.<br />
(At the end of your turn, this Unit recovers the specified number of HP.)<BR/>
【When Paired】If you have 2 or more other Units in play, draw 1.
          </div>
        </div>
      `;

      const result = parseCardHTML(html);

      expect(result).toBeDefined();
      expect(result?.effectText).toContain("<Repair 1>");
      expect(result?.effectText).not.toContain("&lt;");
      expect(result?.effectText).not.toContain("&gt;");
      expect(result?.effectText).not.toContain("<br");
      expect(result?.effectText).not.toContain("<BR");

      // Should have newlines where br tags were
      const lines = result?.effectText.split("\n");
      expect(lines).toBeDefined();
      expect(lines!.length).toBeGreaterThan(1);
    });
  });
});
