import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";
import HandZoneTuckHarness from "./HandZoneTuckHarness.svelte";
import {
  toggleHandTuckState,
  type HandTuckState,
} from "@/features/simulator/board/hand-tuck-state.js";

describe("desktop hand tuck", () => {
  it("renders tuck controls for both desktop hands", () => {
    const { body } = render(HandZoneTuckHarness, {
      props: {
        layoutMode: "desktop",
      },
    });

    expect(body).toContain('data-testid="hand-tuck-toggle-playerOne"');
    expect(body).toContain('data-testid="hand-tuck-toggle-playerTwo"');
    expect(body).toContain("Hide hand");
  });

  it("does not render tuck controls in mobile layout", () => {
    const { body } = render(HandZoneTuckHarness, {
      props: {
        layoutMode: "mobile",
      },
    });

    expect(body).not.toContain("hand-tuck-toggle-playerOne");
    expect(body).not.toContain("hand-tuck-toggle-playerTwo");
  });

  it("renders desktop hand slots with untucked state by default", () => {
    const { body } = render(HandZoneTuckHarness, {
      props: {
        layoutMode: "desktop",
      },
    });

    expect(body).toContain('data-hand-shell-side="playerOne"');
    expect(body).toContain('data-hand-shell-side="playerTwo"');
    expect(body).toContain('data-hand-tucked="false"');
  });

  it("toggles each hand independently in state", () => {
    const initialState: HandTuckState = {
      playerOne: false,
      playerTwo: false,
    };

    const bottomTucked = toggleHandTuckState(initialState, "playerTwo");
    expect(bottomTucked).toEqual({
      playerOne: false,
      playerTwo: true,
    });

    const bothTucked = toggleHandTuckState(bottomTucked, "playerOne");
    expect(bothTucked).toEqual({
      playerOne: true,
      playerTwo: true,
    });

    const bottomUntucked = toggleHandTuckState(bothTucked, "playerTwo");
    expect(bottomUntucked).toEqual({
      playerOne: true,
      playerTwo: false,
    });
  });
});
