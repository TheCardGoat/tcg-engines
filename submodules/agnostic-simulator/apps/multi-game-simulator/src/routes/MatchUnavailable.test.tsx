// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider, useLoaderData } from "react-router";
import { afterEach, expect, test, vi } from "vitest";
import { MatchUnavailable } from "./MatchUnavailable";
import { installBrowserShims } from "../testing/browser-shims";

afterEach(cleanup);

test("offers matchmaking and reloads route data when the player retries", async () => {
  installBrowserShims();
  const loader = vi
    .fn()
    .mockResolvedValueOnce({ error: "We couldn't load this match right now." })
    .mockResolvedValueOnce({ error: null });
  function MatchRoute() {
    const data = useLoaderData<{ error: string | null }>();
    return data.error ? (
      <MatchUnavailable gameSlug="flesh-and-blood" message={data.error} />
    ) : (
      <h1>Match ready</h1>
    );
  }
  const router = createMemoryRouter([{ path: "/", loader, Component: MatchRoute }]);
  render(
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>,
  );
  expect(await screen.findByRole("heading", { name: "Match unavailable" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Back to matchmaking" }).getAttribute("href")).toBe(
    "/flesh-and-blood/matchmaking",
  );
  await userEvent.click(screen.getByRole("button", { name: "Try again" }));
  await waitFor(() => expect(screen.getByRole("heading", { name: "Match ready" })).toBeTruthy());
  expect(loader).toHaveBeenCalledTimes(2);
  router.dispose();
});
