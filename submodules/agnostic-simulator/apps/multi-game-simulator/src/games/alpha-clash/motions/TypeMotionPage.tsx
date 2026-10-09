import { MotionGallery, type MotionGalleryConfig } from "@tcg/simulator-presentation/gallery";
import { rulesUrl, slots, typeMotions } from "./fixtures";
const config: MotionGalleryConfig = {
  game: "Alpha Clash",
  tableOverlay: (
    <>
      <div
        className="zone-well"
        style={{
          left: slots.oblivion.left - 8,
          top: slots.oblivion.top - 8,
          width: 98,
          height: 131,
        }}
      />
      <div className="standby-well" />
    </>
  ),
  rulesUrl,
  rulesLabel: "Official rules v8.0",
  fixtures: typeMotions,
  cards: (fixture) => [
    { id: "subject", ...fixture.card },
    {
      id: "host",
      name: "Captain Maxine Riggins",
      imageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/534928_400w.jpg",
    },
    {
      id: "hero",
      name: "Magnate, Awakened",
      imageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/535079_400w.jpg",
    },
    ...(fixture.id === "clashground"
      ? [
          {
            id: "old",
            name: "United Nations Headquarters",
            imageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/534926_400w.jpg",
          },
        ]
      : []),
  ],
  zones: [
    { label: "CONTENDER", x: 165, y: 240 },
    { label: "CLASH ZONE", x: 815, y: 240 },
    { label: "ACCESSORIES", x: 365, y: 510 },
    { label: "OBLIVION", x: 1063, y: 445 },
    { label: "CLASHGROUND", x: 597, y: 58 },
    { label: "YOUR HAND", x: 592, y: 635 },
  ],
  selected: (fixture, step, id) => id === "host" && fixture.id === "clash-buff" && step === 2,
};
export function TypeMotionPage() {
  return <MotionGallery config={config} />;
}
