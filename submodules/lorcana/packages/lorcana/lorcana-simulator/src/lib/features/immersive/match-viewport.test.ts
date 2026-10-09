import { describe, expect, it } from "bun:test";

import { matchViewportFrameStyle, shouldBlockMatchPageScroll } from "./match-viewport.js";

describe("match viewport", () => {
  it("blocks the spacebar from scrolling the match unless text is being typed", () => {
    expect(shouldBlockMatchPageScroll({ key: " ", target: null })).toBe(true);
    expect(shouldBlockMatchPageScroll({ key: "Spacebar", target: null })).toBe(true);
    expect(shouldBlockMatchPageScroll({ key: "Enter", target: null })).toBe(false);
    expect(shouldBlockMatchPageScroll({ key: " ", metaKey: true, target: null })).toBe(false);
  });

  it("lets a chat field keep spaces", () => {
    if (typeof document === "undefined") {
      return;
    }

    const input = document.createElement("input");
    input.type = "text";
    expect(shouldBlockMatchPageScroll({ key: " ", target: input })).toBe(false);

    const button = document.createElement("button");
    expect(shouldBlockMatchPageScroll({ key: " ", target: button })).toBe(true);
  });

  it("shrinks the match to the visible viewport when the keyboard opens and undoes an iOS pan", () => {
    expect(matchViewportFrameStyle({ innerHeight: 800, visualHeight: 800, offsetTop: 0 })).toEqual({
      height: "",
      transform: "",
    });

    expect(matchViewportFrameStyle({ innerHeight: 844, visualHeight: 720, offsetTop: 0 })).toEqual({
      height: "",
      transform: "",
    });

    expect(matchViewportFrameStyle({ innerHeight: 844, visualHeight: 520, offsetTop: 0 })).toEqual({
      height: "520px",
      transform: "",
    });

    expect(
      matchViewportFrameStyle({ innerHeight: 844, visualHeight: 520, offsetTop: 280 }),
    ).toEqual({ height: "520px", transform: "translateY(280px)" });
  });
});
