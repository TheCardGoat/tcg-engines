import { expect, it, vi } from "vitest";
import { alphaClashCardReleaseIssue, alphaClashReleaseDecks } from "./release-policy";

vi.mock("./release-card-audits.json", async (importOriginal) => {
  const module = await importOriginal<typeof import("./release-card-audits.json")>();
  return { default: { ...module.default, rulesVersion: "7.0" } };
});

it("does not reuse card approval from another rulebook revision", () => {
  expect(alphaClashCardReleaseIssue("ac-ac4-108")).toContain("not passed");
  expect(alphaClashReleaseDecks().every((deck) => deck.issues.length > 0)).toBe(true);
});
