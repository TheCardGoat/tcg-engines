import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const BOARD_CSS = readFileSync("src/games/cyberpunk/components/BoardV2/board.module.css", "utf8");
const BOARD_TSX = readFileSync(
  "src/games/cyberpunk/components/BoardV2/CyberpunkBoardV2.tsx",
  "utf8",
);

/** Declaration bodies of every top-level rule whose selector mentions the needle. */
function ruleBlocks(needle: string): string[] {
  const blocks: string[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(BOARD_CSS))) {
    if (match[1].includes(needle)) {
      blocks.push(match[2]);
    }
  }
  return blocks;
}

/**
 * The cascade value of a property across every rule matching the needle: CSS
 * applies the LAST matching declaration of the highest (equal) specificity, so
 * guarding `blocks[0]` would watch a line the browser never paints.
 */
function lastFontSize(needle: string): number {
  const fontSizes = ruleBlocks(needle).filter((body) => body.includes("font-size"));
  expect(fontSizes.length).toBeGreaterThan(0);
  const block = fontSizes.at(-1)!;
  return Number(block.match(/font-size:\s*([\d.]+)cqi/)?.[1]);
}

// Incident: crowded gig lanes flex-shrink the die anchors, but the face number
// kept a fixed cqw size of the 1600px board overlay, so with ~10 dice the
// digits rendered larger than their dice and piled up across slots.
describe("V2 gig dice scaling", () => {
  test("the gig die is an inline-size container its face number can query", () => {
    const containers = ruleBlocks('[data-testid="gig-die"]').filter((body) =>
      /container-type:\s*inline-size/.test(body),
    );
    expect(containers).toHaveLength(1);
  });

  test("gig die face numbers size in cqi, never a fixed lane-relative cqw", () => {
    const fontSizes = ruleBlocks('[data-testid="gig-die"]').filter((body) =>
      body.includes("font-size"),
    );
    expect(fontSizes.length).toBeGreaterThan(0);
    for (const block of fontSizes) {
      expect(block).toMatch(/font-size:\s*[\d.]+cqi/);
      expect(block).not.toMatch(/font-size:[^;]*cqw/);
    }
  });

  test("the cascade-applied face size leaves headroom inside the die box", () => {
    // A typo'd 520cqi or a loose 5cqi passes a unit-only assertion — pin the
    // magnitude: a plain digit renders around 0.6em, so 52cqi of the die box
    // keeps single digits well inside it without shrinking them away.
    // The needle is the base face rule; the Dicier glyph rule's selector also
    // mentions the die and carries its own, smaller ratio.
    const dieRatio = lastFontSize('gig-die"]) > span > :global([data-cyberpunk-die-face])');
    expect(dieRatio).toBeGreaterThan(30);
    expect(dieRatio).toBeLessThanOrEqual(55);
  });

  test("the Dicier glyph keeps its narrower cqi ratio so two-digit ligatures stay contained", () => {
    // Two-digit Dicier ligature ink measures ~2.2em: 2.2 × ratio must stay
    // under the 100cqi box, so the glyph ratio is bounded both ways.
    const dieRatio = lastFontSize('gig-die"]) > span > :global([data-cyberpunk-die-face])');
    const glyphRatio = ruleBlocks('[class*="fontMd"]').filter((body) => body.includes("font-size"));
    expect(glyphRatio.length).toBeGreaterThan(0);
    const glyphCqi = Number(glyphRatio.at(-1)!.match(/font-size:\s*([\d.]+)cqi/)?.[1]);
    expect(glyphCqi).toBeLessThan(dieRatio);
    expect(glyphCqi * 2.2).toBeLessThanOrEqual(100);
  });

  test("the status rail guards survive child reorders", () => {
    // Street Cred leading the rail orphaned two position-keyed selectors once
    // already: the flex:none guard must key to the element type (the €$ button
    // is no longer :first-child), and the Sell separator must also fire after
    // the button (span + span no longer matches span → button → span).
    expect(BOARD_CSS).toMatch(
      /\.flatOverlay \.status > button,\n\.root \.flatOverlay \.status > span:first-of-type/,
    );
    expect(BOARD_CSS).not.toMatch(/\.status > button:first-child/);
    expect(BOARD_CSS).toMatch(/\.status > button \+ span/);
    // And the DOM order the guards assume: Street Cred span, then the €$ button.
    const rail = BOARD_TSX.slice(BOARD_TSX.indexOf("classes.rivalStatus : classes.localStatus"));
    const streetCred = rail.indexOf('title="Street Cred"');
    const eddies = rail.indexOf("<button");
    expect(streetCred).toBeGreaterThan(-1);
    expect(eddies).toBeGreaterThan(streetCred);
  });
});
