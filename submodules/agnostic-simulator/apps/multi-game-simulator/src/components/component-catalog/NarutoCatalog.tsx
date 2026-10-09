import { useMemo } from "react";
import { getNarutoFixture } from "../../games/naruto/stories/fixtures";
import { projectSimulator } from "../../games/naruto/projection/projectSimulator";
import { CharacterCard } from "../../games/naruto/board/CharacterCard";
import { LeaderZone } from "../../games/naruto/board/LeaderZone";
import { SupportSlot } from "../../games/naruto/board/SupportSlot";
import { SeamPrompt } from "../../games/naruto/board/SeamPrompt";
import { ChakraPips } from "../../games/naruto/board/ChakraPips";
import { NarutoCardImage } from "../../games/naruto/board/NarutoCardImage";
import { CARD_BACK_URL } from "../../games/naruto/projection/labels";
import type { BoardKit } from "../../games/naruto/board/types";
import Workbench, { Specimen } from "./Workbench";
export default function NarutoCatalog({ category }: { category: string }) {
  const projection = useMemo(() => projectSimulator(getNarutoFixture("mid-game")!.state, "p1"), []);
  const kit: BoardKit = {
    projection,
    interactive: false,
    selection: null,
    attackDraft: null,
    dragging: null,
    onEntityClick: () => {},
    onPill: () => {},
    onOpenDetails: () => {},
    onInspect: () => {},
    onCancelChoice: () => {},
  };
  return (
    <div style={{ "--card-w": "150px", "--card-h": "210px" } as React.CSSProperties}>
      <Workbench
        category={category}
        game="naruto"
        source="CharacterCard · LeaderZone · SupportSlot · ChakraPips"
        boardHref="/naruto/simulator/tests/mid-game"
        entities={projection.entities}
        zones={projection.table.zones}
        table={projection.table}
        zonePreview={
          <Specimen
            title="Leader, support and Chakra zones"
            source="LeaderZone · SupportSlot · ChakraPips"
          >
            <LeaderZone leader={projection.bottom.leader} owner="p1" side="bottom" kit={kit} />
            {projection.bottom.supports.flatMap((support) =>
              support
                ? [<SupportSlot key={support.uid} support={support} owner="p1" kit={kit} />]
                : [],
            )}
            <ChakraPips
              chakra={projection.bottom.chakra}
              owner="p1"
              summon={projection.bottom.summon}
              kit={kit}
            />
          </Specimen>
        }
        controlPreview={
          <Specimen title="Turn, phase and action prompt" source="SeamPrompt">
            <SeamPrompt kit={kit} />
          </Specimen>
        }
        supported={["rested", "hidden", "selected", "damage", "bonus"]}
        renderCard={(entity, knobs) => {
          if (knobs.hidden)
            return (
              <NarutoCardImage
                src={CARD_BACK_URL}
                fallbackLabel="Hidden card"
                style={{ width: 150 }}
              />
            );
          const character = [...projection.bottom.characters, ...projection.top.characters].find(
            (card) => card?.uid === entity.id,
          );
          const stateKit = {
            ...kit,
            selection: knobs.selected ? { kind: "character" as const, uid: entity.id } : null,
          };
          if (character)
            return (
              <CharacterCard
                character={{
                  ...character,
                  rested: knobs.rested,
                  damage: knobs.damage,
                  powerBonus: knobs.bonus,
                  power: character.power + knobs.bonus,
                }}
                owner="p1"
                side="bottom"
                kit={stateKit}
              />
            );
          if (entity.id === projection.bottom.leader.uid)
            return (
              <LeaderZone
                leader={{ ...projection.bottom.leader, rested: knobs.rested }}
                owner="p1"
                side="bottom"
                kit={{
                  ...kit,
                  selection: knobs.selected ? { kind: "leader", uid: entity.id } : null,
                }}
              />
            );
          const support = projection.bottom.supports.find((card) => card?.uid === entity.id);
          if (support) return <SupportSlot support={support} owner="p1" kit={kit} />;
          return (
            <NarutoCardImage
              src={entity.imageUrl}
              fallbackLabel={entity.title}
              style={{ width: 150 }}
            />
          );
        }}
        extra={
          <Specimen title="Chakra and Summon" source="ChakraPips · SummonSlot">
            <ChakraPips
              chakra={projection.bottom.chakra}
              owner="p1"
              summon={projection.bottom.summon}
              kit={kit}
            />
          </Specimen>
        }
      />
    </div>
  );
}
