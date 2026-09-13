// @vitest-environment jsdom
import { cleanup, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderFabSimulatorScenario } from "./testing/render-fab-simulator";

afterEach(() => {
  cleanup();
  window.sessionStorage.removeItem("fab-practice:active-match:v1");
});

async function openFixture(slug: string) {
  const result = renderFabSimulatorScenario({ scenarioId: `usurp-preview-${slug}` });
  await result.pom.waitForReady(15_000);
  return result;
}

function currentEffect() {
  return screen.getByRole("region", { name: "Current effect" });
}

function historyText(): string {
  return screen.getByRole("region", { name: "Match history" }).textContent ?? "";
}

function openHistory(): void {
  const historyTab = screen.getByRole("tab", { name: "History" });
  if (historyTab.getAttribute("aria-selected") !== "true") fireEvent.click(historyTab);
}

function expectReadableHistory(): void {
  expect(historyText()).not.toMatch(/player-[12]|undefined|null|\[object Object\]/i);
}

async function resolveCombatDecliningOptionalEffects(
  pom: ReturnType<typeof renderFabSimulatorScenario>["pom"],
  options: { acceptOptional?: boolean } = {},
): Promise<void> {
  for (let step = 0; step < 24 && (await pom.combatStep()) != null; step += 1) {
    const confirmOrder = screen.queryByRole("button", { name: "Confirm order" });
    if (confirmOrder) {
      fireEvent.click(confirmOrder);
      await new Promise((resolve) => setTimeout(resolve, 50));
      continue;
    }
    const decline = screen.queryByRole("button", { name: "Decline" });
    if (decline) {
      fireEvent.click(
        options.acceptOptional ? screen.getByRole("button", { name: "Use effect" }) : decline,
      );
      await new Promise((resolve) => setTimeout(resolve, 50));
      continue;
    }
    const pass =
      screen.queryByTestId("fab-quick-pass") ??
      screen.queryByTestId("fab-action-pass-priority") ??
      screen.queryByTestId("fab-chain-pass-priority") ??
      screen.queryByRole("button", { name: "Close combat chain" });
    if (!pass) {
      const promptKind = screen.getByTestId("fab-practice-page").getAttribute("data-prompt-kind");
      const effect = screen.queryByRole("region", { name: "Current effect" });
      const buttons = Array.from(document.querySelectorAll("button"))
        .map((button) => button.textContent?.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join(" | ");
      throw new Error(`Cannot resolve combat at ${promptKind}: ${effect?.textContent}; ${buttons}`);
    }
    fireEvent.click(pass!);
    await new Promise((resolve) => setTimeout(resolve, 550));
  }
  expect(await pom.combatStep()).toBeNull();
}

describe("recent Usurp card interaction QA", () => {
  it("shows Blessing of Suraya's first Ponder and leaves the next start-phase reward ready to inspect", async () => {
    await openFixture("blessing-of-suraya-yellow");

    expect(screen.getAllByRole("button", { name: /^Ponder, card, player-1/ })).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: /^Blessing of Suraya, card, player-1/ }),
    ).toBeDefined();
    expectReadableHistory();
  });

  it("shows Bravery of the Blade's Courage reward and returned action point", async () => {
    const { pom } = await openFixture("bravery-of-the-blade-red");

    expect(screen.getAllByRole("button", { name: /^Courage, card, player-1/ })).toHaveLength(1);
    expect(await pom.as("player-1").actionPoints()).toBe(1);
    expectReadableHistory();
  });

  it("shows Restless Looter tapped with its discard and replacement draw in the correct zones", async () => {
    const { pom } = await openFixture("restless-looter-red");

    const looter = screen.getByRole("button", { name: /^Restless Looter, card, player-1,/ });
    expect(looter.querySelector("[data-fab-tapped='true']")).not.toBeNull();
    expect(await pom.as("player-1").zoneHas("hand", "Snatch")).toBe(true);
    expect(screen.getByRole("button", { name: /^Inspect Graveyard, 1 card/ })).toBeDefined();
    expectReadableHistory();
  });

  it("shows Restless Templar's Gate reward after the Decay Zombie dies", async () => {
    await openFixture("restless-templar-red");

    expect(
      screen.getAllByRole("button", { name: /^Gate to i'Arathael, card, player-2/ }),
    ).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: /^Restless Templar, card, player-2,/ }),
    ).toBeDefined();
    expectReadableHistory();
  });

  it("destroys Channel Stormgarden's Lightning Flow through Zyggy, then amps Voltic Bolt", async () => {
    const { pom } = await openFixture("channel-stormgarden-yellow");
    const player = pom.as("player-1");

    expect(screen.getAllByRole("button", { name: /^Lightning Flow, card, player-1/ })).toHaveLength(
      1,
    );
    await player.activate("Zyggy");
    fireEvent.click(screen.getByRole("button", { name: /^Lightning Flow, card, player-1/ }));
    await waitFor(() =>
      expect(screen.getByTestId("fab-practice-page").getAttribute("data-prompt-kind")).toBe(
        "activation-target",
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: /^Auric Shards, card, player-1/ }));
    fireEvent.click(within(currentEffect()).getByRole("button", { name: "Confirm" }));
    await waitFor(() =>
      expect(screen.getByTestId("fab-practice-page").getAttribute("data-prompt-kind")).toBe(
        "layer-target",
      ),
    );
    expect(currentEffect().textContent).toContain("Choose targets for Auric Shards");
    fireEvent.click(within(currentEffect()).getByRole("button", { name: "Choose none" }));
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /^Lightning Flow, card, player-1/ })).toBeNull(),
    );
    await player.play("Voltic Bolt", { target: "hero" });
    await new Promise((resolve) => setTimeout(resolve, 100));
    const pendingPrompt = await pom.prompt();
    if (pendingPrompt?.kind === "play-target") {
      fireEvent.click(screen.getByRole("button", { name: /^Dash, leader, player-2/ }));
    }
    while ((await pom.pendingEffectCount()) > 0) await pom.resolvePendingLayer();

    await waitFor(() => expect(player.life()).resolves.toBe(20));
    expect(await pom.as("player-2").life()).toBe(14);
    openHistory();
    await waitFor(() =>
      expect(historyText()).toContain("Practice bot took 6 arcane damage from Voltic Bolt"),
    );
    expectReadableHistory();
  }, 30_000);

  it("resolves Exorcism's empowered attack and explains the hit without engine identifiers", async () => {
    const { pom } = await openFixture("exorcism-red");

    expect(screen.getByTestId("fab-combat-chain").textContent).toContain("7");
    await resolveCombatDecliningOptionalEffects(pom);

    await waitFor(() => expect(historyText()).toContain("hit Practice bot for 7"));
    expectReadableHistory();
  }, 30_000);

  it.each([
    ["mark-of-pathstone-blue", "You gained 1", false],
    ["mark-of-ushering-blue", "created Gate to i'Arathael", false],
    ["mark-of-neverest-blue", "created Corrupted Corpse", true],
  ] as const)(
    "attacks with the bound Ally in %s and renders its hit reward",
    async (slug, reward, acceptOptional) => {
      const { pom } = await openFixture(slug);
      const ally = screen.getByRole("button", { name: /^Limpit, Hop-a-long, card, player-1,/ });

      fireEvent.click(ally);
      await resolveCombatDecliningOptionalEffects(pom, { acceptOptional });

      await waitFor(() => expect(historyText()).toContain(reward));
      if (slug === "mark-of-pathstone-blue") {
        expect(await pom.as("player-1").life()).toBe(21);
      }
      expectReadableHistory();
    },
    30_000,
  );

  it("offers both readable Tome costs and resolves the selected arena Ally", async () => {
    await openFixture("tome-of-necrosis-red");
    const prompt = currentEffect();

    expect(prompt.textContent).toContain(
      "Choose a card to discard or destroy for Tome of Necrosis",
    );
    const arenaAlly = screen.getByRole("button", {
      name: /^Restless Cleric, card, player-1, Power/,
    });
    const handAlly = screen.getByRole("button", {
      name: /^Restless Looter, card, player-1, Red pitch/,
    });
    expect(arenaAlly.querySelector("[data-card-interaction='actionable']")).not.toBeNull();
    expect(handAlly.querySelector("[data-card-interaction='actionable']")).not.toBeNull();

    fireEvent.click(arenaAlly);
    await waitFor(() =>
      expect(screen.queryByRole("region", { name: "Current effect" })).toBeNull(),
    );
    expect(
      screen.getByLabelText("Restless Cleric, card, player-1, Face down, visible only to you"),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: /^Snatch, card, player-1,/ })).toBeDefined();
    await waitFor(() => expect(historyText()).toContain("Restless Cleric was destroyed"));
    expectReadableHistory();
  }, 30_000);

  it("makes Violent Gusto's optional choice explicit and returns matching Auras on hit", async () => {
    const { pom } = await openFixture("violent-gusto-red");
    const prompt = currentEffect();

    expect(prompt.textContent).toContain("Use the optional effect?");
    fireEvent.click(within(prompt).getByRole("button", { name: "Use effect" }));
    await waitFor(() =>
      expect(
        within(screen.getByRole("region", { name: "Opponent arena" })).getByLabelText(
          "Opponent permanents, 1 card",
        ),
      ).toBeDefined(),
    );
    await resolveCombatDecliningOptionalEffects(pom);

    await waitFor(() => expect(historyText()).toContain("hit Practice bot for 6"));
    expect(await pom.as("player-2").handCount()).toBe(2);
    expectReadableHistory();
  }, 30_000);
});
