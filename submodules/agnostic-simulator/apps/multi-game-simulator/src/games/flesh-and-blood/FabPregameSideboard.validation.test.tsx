// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { dashIO } from "@tcg/flesh-and-blood-cards/cards/heroes/dash-i-o";
import { puffinHightail } from "@tcg/flesh-and-blood-cards/cards/heroes/puffin-hightail";
import { riptideLurkerOfTheDeep } from "@tcg/flesh-and-blood-cards/cards/heroes/riptide-lurker-of-the-deep";
import { bravoShowstopper } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo-showstopper";
import { pollyCranka } from "@tcg/flesh-and-blood-cards/cards/companions/polly-cranka";
import { hanabiBlaster } from "@tcg/flesh-and-blood-cards/cards/weapons/hanabi-blaster";
import { deathDealer } from "@tcg/flesh-and-blood-cards/cards/weapons/death-dealer";
import { anothos } from "@tcg/flesh-and-blood-cards/cards/weapons/anothos";
import { driftwoodQuiver } from "@tcg/flesh-and-blood-cards/cards/equipment/driftwood-quiver";
import { steelbraidBuckler } from "@tcg/flesh-and-blood-cards/cards/equipment/steelbraid-buckler";
import { adaptiveAlphaMold } from "@tcg/flesh-and-blood-cards/cards/equipment/adaptive-alpha-mold";
import {
  registerFabCardDefinition,
  type FabPregameCardPool,
  type FabPregameSelection,
} from "@tcg/flesh-and-blood-engine/simulator";
import { FabPregameSideboard } from "./FabPregameSideboard";
import { FabPresentationTestProvider } from "./presentation-test-provider";
import { installBrowserShims } from "../../testing/browser-shims";

type Definition = FabPregameCardPool["cardDefinitions"][string];
function mount(
  hero: Definition,
  arena: readonly Definition[],
  equipment: FabPregameSelection["equipment"],
) {
  const cards = [hero, ...arena].map(registerFabCardDefinition);
  const pool: FabPregameCardPool = {
    format: "cc",
    heroId: cards[0]!.canonicalId,
    entries: cards
      .slice(1)
      .map((card) => ({ canonicalId: card.canonicalId, quantity: 1, source: "equipment" })),
    cardDefinitions: Object.fromEntries(cards.map((card) => [card.canonicalId, card])),
  };
  const onConfirm = vi.fn();
  render(
    <FabPregameSideboard
      pool={pool}
      player={{ label: "You" }}
      opponent={{ label: "Opponent" }}
      initialSelection={{ deck: [], equipment }}
      relaxDeckSize
      onConfirm={onConfirm}
      onLeave={() => {}}
    />,
    { wrapper: FabPresentationTestProvider },
  );
  return onConfirm;
}
describe("FAB equipment selection through real controls", () => {
  beforeEach(installBrowserShims);
  afterEach(cleanup);

  it.each([
    [riptideLurkerOfTheDeep, deathDealer, driftwoodQuiver, "Driftwood Quiver"],
    [puffinHightail, hanabiBlaster, pollyCranka, "Polly Cranka"],
  ] as const)(
    "keeps the two-hander when a legal companion is clicked",
    (hero, weapon, companion, label) => {
      const confirm = mount(hero, [weapon, companion], { weapon1: weapon.canonicalId });
      fireEvent.click(screen.getByRole("button", { name: "Edit loadout" }));
      fireEvent.click(screen.getByRole("button", { name: label }));
      expect(
        within(screen.getByLabelText("Equipped cards")).getByRole("button", {
          name: new RegExp(`Change weapon2 equipment from ${label}`),
        }),
      ).not.toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
      expect(confirm).toHaveBeenCalledWith({
        deck: [],
        equipment: { weapon1: weapon.canonicalId, weapon2: companion.canonicalId },
      });
    },
  );

  it.each([
    [riptideLurkerOfTheDeep, deathDealer, driftwoodQuiver, "Death Dealer", "Driftwood Quiver"],
    [puffinHightail, hanabiBlaster, pollyCranka, "Hanabi Blaster", "Polly Cranka"],
  ] as const)(
    "selects the companion first, then removes it without moving the weapon",
    (hero, weapon, companion, weaponLabel, companionLabel) => {
      const confirm = mount(hero, [weapon, companion], { weapon1: companion.canonicalId });
      fireEvent.click(screen.getByRole("button", { name: "Edit loadout" }));
      fireEvent.click(screen.getByRole("button", { name: weaponLabel }));
      expect(
        within(screen.getByLabelText("Equipped cards")).getByRole("button", {
          name: new RegExp(`Change weapon2 equipment from ${companionLabel}`),
        }),
      ).not.toBeNull();
      fireEvent.click(screen.getByRole("button", { name: companionLabel }));
      fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
      expect(confirm).toHaveBeenCalledWith({
        deck: [],
        equipment: { weapon1: weapon.canonicalId },
      });
    },
  );

  it("reopens a reversed saved bow and quiver in canonical slots", () => {
    const confirm = mount(riptideLurkerOfTheDeep, [deathDealer, driftwoodQuiver], {
      weapon1: driftwoodQuiver.canonicalId,
      weapon2: deathDealer.canonicalId,
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
    expect(confirm).toHaveBeenCalledWith({
      deck: [],
      equipment: { weapon1: deathDealer.canonicalId, weapon2: driftwoodQuiver.canonicalId },
    });
  });

  it("cannot confirm a two-hander plus an ordinary off-hand", () => {
    const confirm = mount(bravoShowstopper, [anothos, steelbraidBuckler], {
      weapon1: anothos.canonicalId,
      weapon2: steelbraidBuckler.canonicalId,
    });
    const button = screen.getByRole("button", { name: "Confirm selection" });
    expect(button.hasAttribute("disabled")).toBe(true);
    fireEvent.click(button);
    expect(confirm).not.toHaveBeenCalled();
  });

  it("selects Modular in a body slot and submits the chosen slot", () => {
    const confirm = mount(dashIO, [adaptiveAlphaMold], {});
    fireEvent.click(
      screen.getByRole("button", {
        name: /Change legs equipment from Empty legs to Adaptive Alpha Mold/,
      }),
    );
    expect(
      within(screen.getByLabelText("Equipped cards")).getByRole("button", {
        name: /Change legs equipment from Adaptive Alpha Mold/,
      }),
    ).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Confirm selection" }));
    expect(confirm).toHaveBeenCalledWith({
      deck: [],
      equipment: { legs: adaptiveAlphaMold.canonicalId },
    });
  });
});
