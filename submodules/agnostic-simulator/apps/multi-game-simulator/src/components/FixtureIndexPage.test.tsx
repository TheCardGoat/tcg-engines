import { render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";
import FixtureIndexPage from "./FixtureIndexPage";

test("discovers opening and connection previews through the shared service routes", () => {
  render(<FixtureIndexPage />);
  expect(
    screen
      .getByRole("link", { name: "Alpha Clash · turn order and mulligan" })
      .getAttribute("href"),
  ).toBe("/alpha-clash/simulator/tests/opening-preview");
  expect(
    screen
      .getByRole("link", { name: "Grand Archive · Spirit reveal and opening hands" })
      .getAttribute("href"),
  ).toBe("/grand-archive/simulator/tests/opening-preview");
  expect(screen.getByRole("link", { name: "Connection and clocks" }).getAttribute("href")).toBe(
    "/simulator-ui-fixtures/connection-clocks",
  );
  expect(
    screen.getAllByRole("link").every((link) => !link.getAttribute("href")?.includes(".html")),
  ).toBe(true);
});
