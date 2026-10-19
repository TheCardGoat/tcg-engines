// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { afterEach, expect, it } from "vite-plus/test";
import { AlphaClashCorrectionFixture } from "./CorrectionFixture";

afterEach(cleanup);
it.each(["top", "bottom"])(
  "moves a card to Oblivion %s through correction controls and the adapter",
  async (position) => {
    const user = userEvent.setup();
    render(
      <MantineProvider env="test">
        <AlphaClashCorrectionFixture />
      </MantineProvider>,
    );
    async function select(label: string, option: string) {
      await user.click(screen.getByRole("combobox", { name: label }));
      await user.click(await screen.findByRole("option", { name: option }));
    }
    const beforeVersion = Number(screen.getByRole("status").textContent?.split(": ")[1]);
    const pile = screen.getByRole("list", { name: "Your Oblivion" });
    const before = within(pile)
      .getAllByRole("listitem")
      .map((item) => item.textContent);
    await select("Correction", "Move card");
    await select("Card", "You · Sonoro · clash");
    await select("Destination", "oblivion");
    await select("Oblivion position", position);
    await user.click(screen.getByRole("button", { name: "Apply correction" }));
    expect(screen.queryByRole("alert")).toBeNull();
    const after = within(pile)
      .getAllByRole("listitem")
      .map((item) => item.textContent);
    expect(after).toEqual(position === "top" ? ["Sonoro", ...before] : [...before, "Sonoro"]);
    expect(screen.getByRole("status").textContent).toBe(`Committed version: ${beforeVersion + 1}`);
  },
);

it("corrects a created Badge without looking up its runtime ID in the printed catalog", async () => {
  const user = userEvent.setup();
  render(
    <MantineProvider env="test">
      <AlphaClashCorrectionFixture />
    </MantineProvider>,
  );
  await user.click(screen.getByRole("button", { name: "Load Badge scenario" }));
  const before = Number(screen.getByRole("status").textContent?.split(": ")[1]);
  await user.click(screen.getByRole("combobox", { name: "Correction" }));
  await user.click(await screen.findByRole("option", { name: "Engage card" }));
  await user.click(screen.getByRole("combobox", { name: "Card" }));
  await user.click(await screen.findByRole("option", { name: "You · Badge · accessory" }));
  await user.click(screen.getByRole("button", { name: "Apply correction" }));
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getByRole("status").textContent).toBe(`Committed version: ${before + 1}`);
  expect(screen.getByRole("list", { name: "Created tokens" }).textContent).toContain(
    "Badge · engaged · accessory",
  );
});
