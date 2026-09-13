import { describe, expect, test } from "vite-plus/test";

import { createAnimationNodeRegistry } from "../lib/node-registry";
import { centerForRef } from "./overlay-utils";

describe("centerForRef", () => {
  test("can preserve outgoing geometry while an entity also exists at its destination", () => {
    const registry = createAnimationNodeRegistry();
    const ref = { kind: "entity", id: "defeated-unit" } as const;
    registry.register({
      key: "battlefield",
      ref,
      node: nodeAt(100, 200, 80, 120),
      presence: "exiting",
    });
    registry.register({
      key: "trash",
      ref,
      node: nodeAt(900, 600, 40, 60),
      presence: "present",
    });

    expect(centerForRef(registry, ref)).toEqual({ x: 920, y: 630 });
    expect(centerForRef(registry, ref, "exiting")).toEqual({ x: 140, y: 260 });
  });
});

function nodeAt(left: number, top: number, width: number, height: number): HTMLElement {
  return {
    getBoundingClientRect: () =>
      ({
        left,
        top,
        width,
        height,
      }) as DOMRect,
  } as HTMLElement;
}
