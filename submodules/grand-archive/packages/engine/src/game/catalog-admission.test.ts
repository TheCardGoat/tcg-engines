import { grandArchiveCards } from "@tcg/grand-archive-cards";
import { expect, it } from "vitest";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";

it("admits every generated catalog card into one executable match program", () => {
  const program = createGrandArchiveMatchProgram(grandArchiveCards);
  expect(Object.keys(program.cardsById)).toHaveLength(grandArchiveCards.length);
  expect(program.fingerprint).toMatch(/^ga-program-v1-[0-9a-f]{8}$/);
});
