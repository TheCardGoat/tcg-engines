import type { CardEffect, TokenSpec, UnitCard } from "@tcg/gundam-types";

/**
 * Build the runtime Unit definition shared by the authoritative engine and
 * live viewers hydrating a serialized token. Gameplay fields always come
 * from TokenSpec. A printed token contributes only presentation metadata.
 */
export function buildTokenUnitDefinition(
  tokenSpec: TokenSpec,
  syntheticId: string,
  printed?: UnitCard,
): UnitCard {
  const cardNumber = printed?.cardNumber ?? tokenSpec.printedCardNumber ?? syntheticId;
  const canonicalId = cardNumber.replace(/[-_]p\d+$/i, "");
  const printing = printed?.printings[0];

  return {
    cardNumber,
    canonicalId,
    slug: `token-${cardNumber.toLowerCase()}`,
    printings: [
      {
        id: printing?.id ?? cardNumber,
        artId: printing?.artId ?? canonicalId,
        setCode: printing?.setCode ?? printing?.set?.code ?? "TOKEN",
        collectorNumber: printing?.collectorNumber ?? cardNumber,
        cardNumber: printing?.cardNumber ?? cardNumber,
        set: printing?.set ?? { code: "TOKEN", name: "Token" },
        rarity: printing?.rarity ?? "common",
        finish: printing?.finish ?? "standard",
        imageUrl: printing?.imageUrl ?? printed?.imageUrl ?? "",
        sourceImageUrl: printing?.sourceImageUrl ?? printed?.sourceImageUrl,
        productName: printing?.productName,
      },
    ],
    color: printed?.color,
    name: tokenSpec.name,
    type: "unit",
    cost: 0,
    traits: [...tokenSpec.traits],
    level: 0,
    keywordEffects: tokenSpec.keywordEffects?.map((entry) => ({ ...entry })) ?? [],
    rarity: "common",
    ap: tokenSpec.ap,
    hp: tokenSpec.hp,
    effect: printed?.effect ?? tokenDisplayText(tokenSpec),
    effects: tokenEffects(tokenSpec),
  };
}

function tokenEffects(tokenSpec: TokenSpec): CardEffect[] {
  const effects: CardEffect[] = [];
  if (tokenSpec.cantTargetPlayer) {
    effects.push({
      type: "constant",
      activation: {},
      directives: [{ action: { action: "cantTargetPlayer", whose: "opponent" } }],
      sourceText: "This Unit can't choose the enemy player as its attack target.",
    });
  }
  if (tokenSpec.restrictions?.length) {
    effects.push({
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "restrictUnit",
            target: { owner: "self", cardType: "unit", count: 1 },
            restrictions: [...tokenSpec.restrictions],
          },
        },
      ],
      sourceText: "This Unit has static token restrictions.",
    });
  }
  return effects;
}

function tokenDisplayText(tokenSpec: TokenSpec): string {
  const text: string[] = [];
  if (tokenSpec.cantTargetPlayer) {
    text.push("This Unit can't choose the enemy player as its attack target.");
  }
  if (
    tokenSpec.restrictions?.includes("cannotSetActive") &&
    tokenSpec.restrictions.includes("cannotPairPilot")
  ) {
    text.push("This Unit can't be set as active or paired with a Pilot.");
  } else {
    if (tokenSpec.restrictions?.includes("cannotSetActive")) {
      text.push("This Unit can't be set as active.");
    }
    if (tokenSpec.restrictions?.includes("cannotPairPilot")) {
      text.push("This Unit can't be paired with a Pilot.");
    }
  }
  return text.join(" ") || "-";
}
