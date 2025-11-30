import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { thePhantomBlotShadowyFigure } from "./135-the-phantom-blot-shadowy-figure";

describe("The Phantom Blot - Shadowy Figure", () => {
  it("should have Rush ability", () => {
    expect(hasRush(thePhantomBlotShadowyFigure)).toBe(true);
  });
});
