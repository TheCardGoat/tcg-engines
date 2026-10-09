// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vite-plus/test";
import { PlayerNameplate } from "./PlayerNameplate";

afterEach(cleanup);
test("shows participant identity, public premium tier, rating and live connection changes", () => {
  const identity = {
    id: "rival",
    displayName: "Night City Runner",
    subscriptionTier: "tier3",
    mmrAtMatch: 1542.4,
  };
  const { rerender } = render(
    <PlayerNameplate
      identity={identity}
      connection={{ connected: true }}
      playerId="p2"
      rival
      turn
      priority
    />,
  );
  expect(screen.getByText(identity.displayName)).toBeTruthy();
  expect(screen.getByText(/Champion/)).toBeTruthy();
  expect(screen.getByText("1542 MMR")).toBeTruthy();
  expect(screen.getByRole("status").textContent).toBe("Connected");
  expect(screen.getByText("TURN / PRIORITY")).toBeTruthy();
  rerender(
    <PlayerNameplate
      identity={identity}
      connection={{ connected: true, status: "reconnecting" }}
      playerId="p2"
      rival
      turn={false}
      priority
    />,
  );
  expect(screen.getByRole("status").textContent).toBe("Reconnecting");
  expect(screen.getByText("PRIORITY")).toBeTruthy();
  rerender(
    <PlayerNameplate
      identity={identity}
      connection={{ connected: false }}
      playerId="p2"
      rival
      turn={false}
      priority={false}
    />,
  );
  expect(screen.getByRole("status").textContent).toBe("Disconnected");
});
test("does not invent presence, premium status or rating for a fixture", () => {
  render(<PlayerNameplate playerId="p1" rival={false} turn={false} priority={false} />);
  expect(screen.getByText("YOU")).toBeTruthy();
  expect(screen.queryByRole("status")).toBeNull();
  expect(screen.queryByText(/MMR|Supporter|Champion|Legend/)).toBeNull();
});
test("shows zero MMR and hides free subscription tiers", () => {
  render(
    <PlayerNameplate
      identity={{ id: "local", displayName: "Player", subscriptionTier: "free", mmrAtMatch: 0 }}
      connection={{}}
      playerId="p1"
      rival={false}
      turn
      priority={false}
    />,
  );
  expect(screen.getByText("0 MMR")).toBeTruthy();
  expect(screen.getByRole("status").textContent).toBe("Checking");
  expect(screen.queryByText(/free/i)).toBeNull();
});
