import { resolveCardDimensions } from "../card/card-image-format.ts";
import { GameCard } from "../GameCard.tsx";

interface DeckStackProps {
  readonly count: number;
  readonly label: string;
  readonly zoneId?: string;
}

export function DeckStack({ count, label, zoneId }: DeckStackProps) {
  const { displayWidth, displayHeight } = resolveCardDimensions("micro");
  const offset = 1.5;
  const stackLayers = 3;
  return (
    <div
      className="relative"
      data-sim-zone-id={zoneId}
      style={{
        width: displayWidth + (stackLayers - 1) * offset,
        height: displayHeight + (stackLayers - 1) * offset,
      }}
    >
      {[2, 1, 0].map((i) => (
        <div key={i} className="absolute" style={{ left: i * offset, top: i * offset }}>
          <GameCard faceDown name="" size="micro" />
        </div>
      ))}
      <div
        className="font-mono absolute -top-[7px] -left-[7px] z-10 text-hud-xs font-bold bg-[#fbfcfe] text-hud-accent px-[5px] py-[1px]"
        style={{ border: "1px solid rgba(45,107,255,.5)" }}
      >
        {String(count).padStart(2, "0")}
      </div>
      <div className="font-mono absolute -bottom-[14px] left-1/2 -translate-x-1/2 text-hud-2xs text-hud-text-faint font-bold whitespace-nowrap tracking-hud-label">
        ◆ {label}
      </div>
    </div>
  );
}
