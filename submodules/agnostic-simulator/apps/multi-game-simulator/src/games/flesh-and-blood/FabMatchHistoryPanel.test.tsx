// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FabMatchHistoryPanel } from "./FabMatchHistoryPanel";
import { installBrowserShims } from "../../testing/browser-shims";

describe("FAB history presentation", () => {
  beforeEach(installBrowserShims);
  afterEach(cleanup);

  it("renders readable stat symbols in narrative, metrics and costs while keeping card references interactive", () => {
    const preview = vi.fn();
    render(
      <MantineProvider>
        <FabMatchHistoryPanel
          turnOwnerLabel={() => "You"}
          renderCardReference={(card) => (
            <button onClick={() => preview(card.name)}>{card.name}</button>
          )}
          rows={[
            {
              id: "attack",
              turn: 1,
              timestamp: new Date(0).toISOString(),
              kind: "combat",
              title: "Run Through gives the next attack +2 power",
              cardRefs: [{ name: "Run Through" }],
              metrics: [
                {
                  kind: "comparison",
                  leftLabel: "Attack",
                  left: 4,
                  rightLabel: "Defense",
                  right: 6,
                },
              ],
              details: [
                {
                  kind: "cards",
                  label: "Cost",
                  lead: "Pitched",
                  cards: [{ name: "Authority of Ataya" }],
                  amount: 3,
                },
                {
                  kind: "cards",
                  label: "",
                  lead: "Pitched",
                  cards: [{ name: "Burdens of the Past" }],
                  amount: 3,
                },
                { kind: "text", text: "Paid 2 resources" },
              ],
            },
            {
              id: "unknown",
              turn: 1,
              timestamp: new Date(1).toISOString(),
              kind: "activity",
              title: "You played 2 Power Cards",
              cardRefs: [{ name: "2 Power Cards" }],
              metrics: [
                { kind: "value", label: "Damage", value: 2 },
                { kind: "change", label: "Defense", before: 3, after: 5 },
              ],
            },
          ]}
        />
      </MantineProvider>,
    );

    expect(screen.getAllByRole("img", { name: /power|Attack/ })).toHaveLength(2);
    expect(screen.getAllByRole("img", { name: "Defense" })).toHaveLength(2);
    expect(screen.getAllByRole("img", { name: "resources" })).toHaveLength(1);
    const cost = screen.getByRole("button", { name: "Authority of Ataya" }).parentElement
      ?.parentElement;
    expect(cost?.textContent).toBe("Cost · Pitched Authority of Ataya, Burdens of the Past");
    expect(cost?.textContent?.match(/Pitched/g)).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Authority of Ataya" }).closest("li")?.textContent,
    ).not.toContain("for 3");
    expect(screen.getByText("vs")).toBeTruthy();
    expect(screen.getByText("Damage")).toBeTruthy();
    expect(screen.getByRole("button", { name: "2 Power Cards" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Run Through" }));
    fireEvent.click(screen.getByRole("button", { name: "Authority of Ataya" }));
    fireEvent.click(screen.getByRole("button", { name: "Burdens of the Past" }));
    expect(preview.mock.calls).toEqual([
      ["Run Through"],
      ["Authority of Ataya"],
      ["Burdens of the Past"],
    ]);
  });
});
