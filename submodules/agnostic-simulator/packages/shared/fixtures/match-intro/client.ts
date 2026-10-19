import { beginMatchIntro, resumeMatchIntro, finishMatchIntro } from "../../src/match-intro";

const params = new URLSearchParams(location.search);
const banners = params.get("variant") === "banners";
const game = banners ? "alpha-clash" : "gundam";
if (location.pathname === "/lobby") {
  document.getElementById("start")?.addEventListener("click", () => {
    beginMatchIntro({
      variant: banners ? "banners" : undefined,
      href: `/${game}/simulator/matches/fixture-match/games/fixture-game${location.search}`,
      gameName: banners ? "Alpha Clash" : "Gundam Card Game",
      playerName: params.has("long") ? "A very long player display name" : "Nova",
      opponentName: params.has("long") ? "A second very long display name" : "Atlas",
      heading: "Match starting",
      loadingLabel: "Preparing the table…",
      skipLabel: "Go to match",
    });
  });
} else {
  resumeMatchIntro();
  const delay = params.has("slow") ? 4000 : 900;
  if (!params.has("stalled")) {
    setTimeout(() => {
      document.getElementById("board")?.removeAttribute("hidden");
      document.getElementById("loading")?.remove();
      finishMatchIntro(
        banners
          ? {
              players: [
                {
                  name: params.has("long") ? "A very long player display name" : "Nova",
                  artwork: params.get("playerArt") ?? undefined,
                },
                {
                  name: params.has("long") ? "A second very long display name" : "Atlas",
                  artwork: params.get("opponentArt") ?? undefined,
                },
              ],
            }
          : undefined,
      );
    }, delay);
  }
}
