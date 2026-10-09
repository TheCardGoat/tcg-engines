import { useEffect, useState, type ComponentType } from "react";
import { useParams } from "react-router";
import { OpeningFixturePage } from "../simulator/opening/OpeningFixturePage";
import { grandArchiveOpening } from "../games/grand-archive/opening-fixture";

export default function OpeningPreviewRoute() {
  const { gameSlug } = useParams();
  if (gameSlug !== "alpha-clash" && gameSlug !== "grand-archive")
    return <p>No opening fixture for this game.</p>;
  if (gameSlug === "alpha-clash") return <AlphaClashOpeningPreview />;
  return <OpeningFixturePage fixture={grandArchiveOpening} />;
}

/** Match the other engine fixtures: initialize the browser-owned engine after hydration. */
function AlphaClashOpeningPreview() {
  const [FixturePage, setFixturePage] = useState<ComponentType<{ fixtureId: string }>>();
  const [error, setError] = useState<string>();
  useEffect(() => {
    let active = true;
    void import("../games/alpha-clash/pages/Practice.page").then(
      (module) => {
        if (active) setFixturePage(() => module.AlphaClashPracticePage);
      },
      () => {
        if (active) setError("Unable to load the opening fixture. Reload to retry.");
      },
    );
    return () => {
      active = false;
    };
  }, []);
  if (!FixturePage)
    return (
      <main
        className="flex min-h-svh items-center justify-center bg-[#070e16] text-[#b9cbd3]"
        role="status"
      >
        {error ?? "Preparing the opening hands…"}
      </main>
    );
  return <FixturePage fixtureId="opening-preview" />;
}
