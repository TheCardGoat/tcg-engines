// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vite-plus/test";

import { TabletopDie, TabletopDieButton } from "./TabletopDie";

describe("tabletop dice", () => {
  test("describes symbolic faces and preserves zero without inventing a result", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(
      <>
        <TabletopDie label="d10" value={0} />
        <TabletopDie label="Combat" value="block" />
        <TabletopDie label="Unrolled d6" />
      </>,
    );
    expect(
      Array.from(host.querySelectorAll('[role="img"]'), (node) => node.getAttribute("aria-label")),
    ).toEqual(["d10 showing 0", "Combat showing block", "Unrolled d6"]);
    expect(host.textContent).toContain("—");
  });

  test("a skinned face retains its accessible value", () => {
    const host = document.createElement("div");
    host.innerHTML = renderToStaticMarkup(
      <TabletopDie label="d8" value={7} appearance="bare" className="game-face">
        <img src="/die.svg" alt="" />
      </TabletopDie>,
    );
    expect(host.querySelector('[role="img"]')?.getAttribute("aria-label")).toBe("d8 showing 7");
    expect(host.querySelector('[role="img"]')?.className).toBe("game-face");
  });

  test("dispatches only enabled clicks and follows controlled selection", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    const onClick = vi.fn();
    const render = (disabled: boolean, selected: boolean) => (
      <TabletopDieButton
        actionLabel="Select d6 showing 4"
        disabled={disabled}
        selected={selected}
        onClick={onClick}
      >
        <TabletopDie label="d6" value={4} />
      </TabletopDieButton>
    );
    try {
      await act(async () => root.render(render(false, false)));
      const button = host.querySelector("button")!;
      await act(async () => button.click());
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(button.getAttribute("aria-pressed")).toBe("false");
      expect(button.type).toBe("button");
      await act(async () => root.render(render(true, true)));
      await act(async () => button.click());
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(button.getAttribute("aria-pressed")).toBe("true");
    } finally {
      await act(async () => root.unmount());
      host.remove();
    }
  });
});
