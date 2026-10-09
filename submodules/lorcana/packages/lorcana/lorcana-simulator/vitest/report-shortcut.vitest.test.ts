// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import ReportShortcutHarness from "./ReportShortcutHarness.svelte";

vi.mock("$env/dynamic/public", () => ({ env: {} }));

beforeEach(() => {
  // jsdom does not provide layout observation. The action tests retain the real tooltip.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test.each([false, true])(
  "report shortcut invokes its action with a reminder (mobile=%s)",
  async (mobile) => {
    const onSupportClick = vi.fn();
    const view = render(ReportShortcutHarness, { props: { onSupportClick, mobile } });
    await fireEvent.click(
      view.getByRole("button", { name: "Open bug report and feedback options" }),
    );
    expect(onSupportClick).toHaveBeenCalledTimes(1);
    expect(view.queryByRole("button", { name: "Report a bug", exact: true })).toBeNull();
  },
);

test.each([false, true])("reminder CTA invokes its action (mobile=%s)", async (mobile) => {
  const onSupportClick = vi.fn();
  const view = render(ReportShortcutHarness, {
    props: { onSupportClick, mobile, reminderOpen: true },
  });
  const reportButton = await view.findByRole("button", { name: "Report a bug", exact: true });
  await fireEvent.click(reportButton);
  expect(onSupportClick).toHaveBeenCalledTimes(1);
  expect(view.queryByRole("button", { name: "Report a bug", exact: true })).toBeNull();
});
