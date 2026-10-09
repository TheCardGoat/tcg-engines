import { useMemo, useState } from "react";
import {
  st01Gundam001,
  st01Guncannon003,
  st01AmuroRay010,
  st01WhiteBase015,
  st01AsticassiaSchoolOfTechnologyEarthHouse016,
  st01Resource001,
} from "@tcg/gundam-cards";
import { cardDefinitionToGameCardData } from "../../games/gundam/src/components/containers/mappers";
import { CardFace } from "../../games/gundam/src/components/ui/card/CardFace";
import { toSimulatorEntity } from "../../games/gundam/src/components/ui/card/to-simulator-entity";
import { DeckStack } from "../../games/gundam/src/components/ui/playerSeat/DeckStack";
import { ShieldPips } from "../../games/gundam/src/components/ui/playerSeat/ShieldPips";
import { GundamSimulatorEntityVisual } from "../../games/gundam/src/animation/gundamAnimationVisual";
import Workbench, { Specimen } from "./Workbench";
export default function GundamCatalog({ category }: { category: string }) {
  const [deployed, setDeployed] = useState(false);
  const [paired, setPaired] = useState(false);
  const cards = useMemo(
    () =>
      [
        st01Gundam001,
        st01Guncannon003,
        st01AmuroRay010,
        st01WhiteBase015,
        st01AsticassiaSchoolOfTechnologyEarthHouse016,
        st01Resource001,
      ].map((card, i) => cardDefinitionToGameCardData(card, `catalog-gundam-${i}`)),
    [],
  );
  return (
    <>
      <label>
        <input type="checkbox" checked={deployed} onChange={(e) => setDeployed(e.target.checked)} />{" "}
        Deployed this turn
      </label>{" "}
      <label>
        <input type="checkbox" checked={paired} onChange={(e) => setPaired(e.target.checked)} />{" "}
        Link unit · can attack on deployment
      </label>
      <Workbench
        category={category}
        game="gundam"
        source="Gundam CardFace · deployed overlay · damage and current stat badges"
        boardHref="/gundam/simulator/tests/main-phase-demo"
        entities={cards.map((card) => toSimulatorEntity(card))}
        visualRenderer={GundamSimulatorEntityVisual}
        zonePreview={
          <Specimen title="Deck stacks and shields" source="DeckStack · ShieldPips">
            <DeckStack count={30} label="Deck" zoneId="deck:p1" />
            <DeckStack count={10} label="Resource Deck" zoneId="resourceDeck:p1" />
            <ShieldPips value={4} low={false} listLabel="Shields" />
          </Specimen>
        }
        supported={["rested", "hidden", "selected", "highlighted", "damage", "bonus"]}
        renderCard={(entity, knobs) => {
          const card = cards.find((card) => card.id === entity.id)!;
          return (
            <CardFace
              card={{
                ...card,
                faceDown: knobs.hidden,
                exerted: knobs.rested,
                selected: knobs.selected,
                highlight: knobs.highlighted,
                damage: knobs.damage,
                baseAp: card.ap,
                ap: card.ap == null ? card.ap : card.ap + knobs.bonus,
                deployedThisTurn: deployed,
                canAttackThisTurn: !deployed || paired,
                isLinkUnit: paired,
                pairedPilot: paired && card.cardType === "unit" ? cards[2] : undefined,
              }}
              width={180}
              height={251}
            />
          );
        }}
      />
    </>
  );
}
