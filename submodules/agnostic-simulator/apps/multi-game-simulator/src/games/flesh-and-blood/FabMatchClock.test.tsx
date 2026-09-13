import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { createFabClock } from "@tcg/flesh-and-blood-server-adapter/clock";
import { FabMatchClock } from "./FabMatchClock";
afterEach(cleanup);
it("shows server time, active reserve exhaustion and the opponent's paused reserve", () => {
  const clock = createFabClock(
    { mode: "dynamic", initialReserveMs: 180_000 },
    ["a", "b"],
    "a",
    1_000,
  );
  const { rerender } = render(
    <FabMatchClock clock={clock} playerId="a" label="You" now={31_000} />,
  );
  expect(screen.getByRole("timer", { name: "You: 2:30" }).dataset.active).toBe("true");
  rerender(<FabMatchClock clock={clock} playerId="a" label="You" now={186_000} />);
  const expired = screen.getByRole("timer", { name: "You: 0:00, time expired" });
  expect(expired.dataset.urgency).toBe("critical");
  expect(expired.dataset.expired).toBe("true");
  expect(expired.getAttribute("title")).toBe("Time expired");
  rerender(<FabMatchClock clock={clock} playerId="b" label="Opponent" now={186_000} />);
  expect(screen.getByRole("timer", { name: "Opponent: 3:00" }).dataset.active).toBe("false");
  rerender(<FabMatchClock playerId="a" label="You" now={186_000} />);
  expect(screen.queryByRole("timer")).toBeNull();
});
