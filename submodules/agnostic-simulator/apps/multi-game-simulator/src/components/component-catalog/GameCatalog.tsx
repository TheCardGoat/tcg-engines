import { lazy, Suspense } from "react";
import type { GameSlug } from "@tcg/simulator-contract";
const OnePiece = lazy(() => import("./OnePieceCatalog"));
const Gundam = lazy(() => import("./GundamCatalog"));
const Riftbound = lazy(() => import("./RiftboundCatalog"));
const Fab = lazy(() => import("./FabCatalog"));
const GrandArchive = lazy(() => import("./GrandArchiveCatalog"));
const Naruto = lazy(() => import("./NarutoCatalog"));
const AlphaClash = lazy(() => import("./AlphaClashCatalog"));
export default function GameCatalog({ game, category }: { game: GameSlug; category: string }) {
  const props = { category };
  return (
    <Suspense fallback={<p role="status">Loading {game} components…</p>}>
      {game === "one-piece" ? (
        <OnePiece {...props} />
      ) : game === "gundam" ? (
        <Gundam {...props} />
      ) : game === "riftbound" ? (
        <Riftbound {...props} />
      ) : game === "flesh-and-blood" ? (
        <Fab {...props} />
      ) : game === "grand-archive" ? (
        <GrandArchive {...props} />
      ) : game === "naruto" ? (
        <Naruto {...props} />
      ) : game === "alpha-clash" ? (
        <AlphaClash {...props} />
      ) : null}
    </Suspense>
  );
}
