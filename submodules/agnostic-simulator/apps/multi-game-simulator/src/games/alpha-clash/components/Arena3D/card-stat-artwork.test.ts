import { expect, test } from "vite-plus/test";
import { cardStatArtwork } from "./card-stat-artwork";

test("live zero, modified combat stats and current health replace the printed values", () => {
  const svg = cardStatArtwork({
    attack: 0,
    defense: 12,
    health: 20,
    contender: true,
    color: "red",
  });
  expect(svg).toContain('data-value="attack">0</text>');
  expect(svg).toContain('data-value="defense">12</text>');
  expect(svg).toContain('data-value="health">20</text>');
  expect(svg).toContain("translate(0 -4)");
  expect(svg).toContain("#8d2428");
});

test("missing or non-finite values do not fabricate a stat or health frame", () => {
  const svg = cardStatArtwork({
    attack: NaN,
    defense: undefined,
    health: Infinity,
    contender: false,
    color: "green",
  });
  expect(svg).not.toContain("data-value=");
  const clash = cardStatArtwork({ attack: 2, defense: 2, contender: false, color: "green" });
  expect(clash).toContain('data-value="defense">2</text>');
  expect(clash).not.toContain('data-value="health"');
});
