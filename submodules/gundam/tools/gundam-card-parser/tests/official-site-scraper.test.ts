import { describe, expect, test } from "vite-plus/test";
import {
  parseOfficialCardDetail,
  parseOfficialCardIds,
  parseOfficialSetList,
} from "../src/scrapers/official-site.ts";

describe("official site scraper parsing", () => {
  test("discovers package-backed set options", () => {
    const sets = parseOfficialSetList(`
      <a class="js-selectBtn-package is-current" data-val="">ALL</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616101">Newtype Rising [GD01]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616102">Dual Impact [GD02]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616103">Steel Requiem [GD03]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616104">Phantom Aria [GD04]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616001">Heroic Beginnings [ST01]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616002">Wings of Advance [ST02]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616003">Zeon's Rush [ST03]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616004">SEED Strike [ST04]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616005">Iron Bloom [ST05]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616006">Clan Unity [ST06]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616007">Celestial Drive [ST07]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616008">Flash of Radiance [ST08]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616009">Destiny Ignition [ST09]</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616701">Other Product Card</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616000">Edition Beta</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616801">Basic Cards</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616901">Promotion card</a>
      <a class="js-selectBtn-package is-current" data-val="">ALL</a>
      <a href="javascript:void(0);" class="js-selectBtn-package" data-val="616103">Steel Requiem [GD03]</a>
    `);

    expect(sets).toEqual([
      { id: "gd01", name: "Newtype Rising [GD01]", packageId: "616101" },
      { id: "gd02", name: "Dual Impact [GD02]", packageId: "616102" },
      { id: "gd03", name: "Steel Requiem [GD03]", packageId: "616103" },
      { id: "gd04", name: "Phantom Aria [GD04]", packageId: "616104" },
      { id: "st01", name: "Heroic Beginnings [ST01]", packageId: "616001" },
      { id: "st02", name: "Wings of Advance [ST02]", packageId: "616002" },
      { id: "st03", name: "Zeon's Rush [ST03]", packageId: "616003" },
      { id: "st04", name: "SEED Strike [ST04]", packageId: "616004" },
      { id: "st05", name: "Iron Bloom [ST05]", packageId: "616005" },
      { id: "st06", name: "Clan Unity [ST06]", packageId: "616006" },
      { id: "st07", name: "Celestial Drive [ST07]", packageId: "616007" },
      { id: "st08", name: "Flash of Radiance [ST08]", packageId: "616008" },
      { id: "st09", name: "Destiny Ignition [ST09]", packageId: "616009" },
      { id: "other-product-card", name: "Other Product Card", packageId: "616701" },
      { id: "edition-beta", name: "Edition Beta", packageId: "616000" },
      { id: "basic-cards", name: "Basic Cards", packageId: "616801" },
      { id: "promotion-card", name: "Promotion card", packageId: "616901" },
    ]);
  });

  test("extracts base card ids and alternate printing ids from card list links", () => {
    const ids = parseOfficialCardIds(`
      <a data-src="detail.php?detailSearch=GD03-001"></a>
      <a data-src="detail.php?detailSearch=GD03-001_p1"></a>
      <a data-src="detail.php?detailSearch=R-020_p2"></a>
      <a data-src="detail.php?detailSearch=GD03-001"></a>
    `);

    expect(ids).toEqual(["GD03-001", "GD03-001_p1", "R-020_p2"]);
  });

  test("parses card detail pages into raw card data", () => {
    const card = parseOfficialCardDetail(
      `
      <div class="cardNo">GD01-001</div>
      <div class="rarity">LR</div>
      <h1 class="cardName">Gundam</h1>
      <div class="cardImage"><img src="../images/cards/card/GD01-001.webp?260424" alt="Gundam"></div>
      <dl class="dataBox side"><dt class="dataTit">Lv.</dt><dd class="dataTxt">4</dd></dl>
      <dl class="dataBox side"><dt class="dataTit">COST</dt><dd class="dataTxt">3</dd></dl>
      <dl class="dataBox side"><dt class="dataTit">COLOR</dt><dd class="dataTxt">Blue</dd></dl>
      <dl class="dataBox side"><dt class="dataTit">TYPE</dt><dd class="dataTxt">UNIT</dd></dl>
      <div class="cardDataRow overview"><div class="dataTxt isRegular">
        All your Units gain &lt;Repair 1&gt;.<br>【When Paired】Draw 1.
      </div></div>
      <dl class="dataBox"><dt class="dataTit">Zone</dt><dd class="dataTxt">Space Earth</dd></dl>
      <dl class="dataBox"><dt class="dataTit">Trait</dt><dd class="dataTxt">(Earth Federation) (White Base Team)</dd></dl>
      <dl class="dataBox"><dt class="dataTit">Link</dt><dd class="dataTxt">[Amuro Ray]</dd></dl>
      <dl class="dataBox side"><dt class="dataTit">AP</dt><dd class="dataTxt">3</dd></dl>
      <dl class="dataBox side"><dt class="dataTit">HP</dt><dd class="dataTxt">3</dd></dl>
      <dl class="dataBox"><dt class="dataTit">Source Title</dt><dd class="dataTxt">Mobile Suit Gundam</dd></dl>
      <dl class="dataBox"><dt class="dataTit">Where to get it</dt><dd class="dataTxt isRegular">Newtype Rising [GD01]</dd></dl>
    `,
      "GD01-001_p1",
      { id: "gd01", name: "Newtype Rising [GD01]", packageId: "616101" },
    );

    expect(card).toMatchObject({
      id: "GD01-001_p1",
      code: "GD01-001",
      name: "Gundam",
      rarity: "LR",
      cardType: "UNIT",
      level: "4",
      cost: 3,
      color: "Blue",
      ap: 3,
      hp: 3,
      effect: "All your Units gain <Repair 1>.\n【When Paired】Draw 1.",
      zone: "Space Earth",
      trait: "(Earth Federation) (White Base Team)",
      link: "[Amuro Ray]",
      sourceTitle: "Mobile Suit Gundam",
      getIt: "Newtype Rising [GD01]",
      set: { id: "gd01", name: "Newtype Rising [GD01]", packageId: "616101" },
    });
  });
});
