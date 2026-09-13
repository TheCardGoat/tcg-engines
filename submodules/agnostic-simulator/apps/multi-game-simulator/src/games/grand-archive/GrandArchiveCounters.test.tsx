// @vitest-environment jsdom
import { cleanup, render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { MantineProvider } from "@mantine/core";
import { GrandArchiveRoleCard } from "./GrandArchiveRoleCard";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";

afterEach(cleanup);
const fixture = GRAND_ARCHIVE_VISUAL_FIXTURES.find((entry) => entry.id === "counter-identity")!;
const ally = fixture.entities.find((entity) =>
  entity.decorations?.some((entry) => entry.id === "ga:counter:buff"),
)!;
function card(entity: SimulatorEntity, onClick = vi.fn()) {
  return (
    <MantineProvider env="test">
      <GrandArchiveRoleCard entity={entity} density="mini" as="button" onClick={onClick} />
    </MantineProvider>
  );
}

describe("Grand Archive counter inspection", () => {
  it("shows all engine-projected counters through overflow without selecting the card", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(card(ally, select));
    const inspect = screen.getByRole("button", { name: `Inspect counters on ${ally.title}` });
    expect(inspect.textContent).toContain("+2");
    await user.click(inspect);
    const region = await screen.findByRole("region", { name: `Counters on ${ally.title}` });
    expect(region.textContent).toContain("Buff: 2");
    expect(region.textContent).toContain("Bulwark: 1");
    expect(region.textContent).toContain("Static: 2");
    expect(region.textContent).toContain("Clears during the end phase");
    expect(region.textContent).not.toContain("Preparation");
    expect(select).not.toHaveBeenCalled();
    await user.click(within(region).getByRole("button", { name: "Close counters" }));
    await user.click(screen.getByRole("button", { name: new RegExp(`^${ally.title},`) }));
    expect(select).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard opening and Escape, and removes stale counters on a hidden update", async () => {
    const user = userEvent.setup();
    const { rerender } = render(card(ally));
    const inspect = screen.getByRole("button", { name: `Inspect counters on ${ally.title}` });
    inspect.focus();
    await user.keyboard("{Enter}");
    expect(inspect.getAttribute("aria-expanded")).toBe("true");
    await screen.findByRole("region", { name: `Counters on ${ally.title}` });
    await user.keyboard("{Escape}");
    expect(inspect.getAttribute("aria-expanded")).toBe("false");
    rerender(card({ ...ally, face: "hidden" }));
    expect(screen.queryByRole("button", { name: /Inspect counters/ })).toBeNull();
    expect(screen.queryByText(/Bulwark/)).toBeNull();
  });

  it("replaces counts after an authoritative update and preserves combat-role names", async () => {
    const user = userEvent.setup();
    const entity: SimulatorEntity = {
      ...ally,
      decorations: [
        ...ally.decorations!,
        {
          id: "combat:attacker",
          slot: "top-start",
          ariaLabel: "Attacker",
          content: { kind: "text", text: "A" },
        },
      ],
    };
    const { rerender } = render(card(entity));
    expect(
      screen
        .getByRole("button", { name: new RegExp(`^${ally.title},`) })
        .getAttribute("aria-label"),
    ).toContain("Attacker");
    await user.click(screen.getByRole("button", { name: /Inspect counters/ }));
    rerender(
      card({
        ...entity,
        decorations: entity.decorations!.filter((entry) => entry.id === "ga:counter:damage"),
      }),
    );
    const region = await screen.findByRole("region", { name: `Counters on ${ally.title}` });
    expect(region.textContent).toContain("Damage: 1");
    expect(region.textContent).not.toContain("Buff");
  });
  it.each(["removed", "hidden", "incarnation"])(
    "returns focus when an open inspector is %s",
    async (update) => {
      const user = userEvent.setup();
      const { rerender } = render(card(ally));
      await user.click(screen.getByRole("button", { name: /Inspect counters/ }));
      const close = await screen.findByRole("button", { name: "Close counters" });
      close.focus();
      rerender(
        card({
          ...ally,
          ...(update === "removed" ? { decorations: [] } : {}),
          ...(update === "hidden" ? { face: "hidden" as const } : {}),
          ...(update === "incarnation"
            ? { dataAttributes: { ...ally.dataAttributes, "data-incarnation": 99 } }
            : {}),
        }),
      );
      await waitFor(() => expect(document.activeElement).toBe(screen.getAllByRole("button")[0]));
      expect(screen.queryByRole("region")).toBeNull();
    },
  );

  it.each(["targetable", "selected"] as const)(
    "lets %s cards receive selection without an inspection target",
    async (state) => {
      const user = userEvent.setup();
      const select = vi.fn();
      render(
        <MantineProvider env="test">
          <GrandArchiveRoleCard entity={ally} {...{ [state]: true }} onClick={select} />
        </MantineProvider>,
      );
      expect(screen.queryByRole("button", { name: /Inspect counters/ })).toBeNull();
      const target = screen.getByRole("button");
      expect(target.getAttribute("aria-label")).toContain("Buff: 2");
      expect(target.getAttribute("aria-label")).toContain("Damage: 1");
      const pills = target.querySelectorAll("[data-decoration-id]");
      expect(pills).toHaveLength(1);
      expect(pills[0]?.textContent).toBe("1");
      expect(pills[0]?.getAttribute("data-decoration-id")).toBe("ga:counter:damage");
      await user.click(target);
      expect(select).toHaveBeenCalledOnce();
    },
  );

  it("keeps prompt candidates free of nested buttons and forwards selection", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(
      <MantineProvider env="test">
        <button onClick={select}>
          <GrandArchiveRoleCard as="div" entity={ally} />
        </button>
      </MantineProvider>,
    );
    expect(screen.getAllByRole("button")).toHaveLength(1);
    await user.click(screen.getByRole("button"));
    expect(select).toHaveBeenCalledOnce();
  });
});
