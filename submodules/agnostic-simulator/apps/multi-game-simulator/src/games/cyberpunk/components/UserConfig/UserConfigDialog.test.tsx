// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";

import { UserConfigProvider } from "../../engine";
import { UserConfigButton } from "./UserConfigDialog";

describe("UserConfigButton", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  test("updates the field card size setting", () => {
    render(
      <UserConfigProvider>
        <UserConfigButton />
      </UserConfigProvider>,
    );

    fireEvent.click(screen.getByLabelText("Open simulator settings"));

    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Game" }));
    expect(screen.getByLabelText("Compact")).toBeTruthy();
    expect(screen.getByLabelText("Standard")).toBeTruthy();
    expect(screen.getByLabelText("Large")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Large"));

    expect(JSON.parse(window.localStorage.getItem("cyberpunk:userConfig") ?? "{}")).toMatchObject({
      fieldCardSize: "large",
    });
  });
});
