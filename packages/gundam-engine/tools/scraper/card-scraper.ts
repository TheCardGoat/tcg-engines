/**
 * Gundam Card Scraper
 * 
 * Fetches card data from the official Gundam Card Game website.
 */

export type ScrapedCardData = {
  cardNumber: string;
  name: string;
  cardType: string;
  rarity: string;
  level?: string;
  cost?: string;
  color?: string;
  ap?: string;
  hp?: string;
  zone?: string;
  trait?: string;
  link?: string;
  effectText: string;
  sourceTitle?: string;
  imageUrl?: string;
};

/**
 * Scrapes a single card from the official website
 */
export async function scrapeCard(cardNumber: string): Promise<ScrapedCardData | null> {
  const url = `https://www.gundam-gcg.com/en/cards/detail.php?detailSearch=${cardNumber}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return null;
    }

    // Check if we were redirected (card doesn't exist)
    if (response.url !== url) {
      if (
        response.url.includes("/en/index.php") ||
        response.url.endsWith("/en/") ||
        response.url.endsWith("/en") ||
        !response.url.includes("detail.php")
      ) {
        console.log(`Card ${cardNumber} does not exist (redirected to homepage)`);
        return null;
      }
    }

    const html = await response.text();
    return parseCardHTML(html);
  } catch (error) {
    console.error(`Error scraping card ${cardNumber}:`, error);
    return null;
  }
}

/**
 * Validates if the HTML is a valid card page
 */
function isValidCardPage(html: string): boolean {
  const hasCardNumber = html.includes('class="cardNo"');
  const hasCardName = html.includes('class="cardName"');
  const hasDataBoxes = html.includes('class="dataBox');

  // Check for homepage indicators
  const isHomepage =
    html.includes("The GANDAM CARD GAME launches on Friday") ||
    html.includes("LEARN TO PLAY") ||
    html.includes("Start playing the GUNDAM CARD GAME") ||
    html.includes("WHAT'S NEW");

  // Check for logo-only page
  const isLogoOnly =
    html.includes("/en/images/common/logo.png") && !hasCardNumber;

  return hasCardNumber && hasCardName && hasDataBoxes && !isHomepage && !isLogoOnly;
}

/**
 * Parses HTML content to extract card data
 */
export function parseCardHTML(html: string): ScrapedCardData | null {
  try {
    if (!isValidCardPage(html)) {
      return null;
    }

    // Extract card number
    const cardNumberMatch = html.match(/<div class="cardNo">\s*([^<]+)\s*<\/div>/);
    const cardNumber = cardNumberMatch?.[1]?.trim() || "";

    // Extract rarity
    const rarityMatch = html.match(/<div class="rarity">\s*([^<]+)\s*<\/div>/);
    const rarity = rarityMatch?.[1]?.trim() || "";

    // Extract card name
    const cardNameMatch = html.match(/<h1 class="cardName">([^<]+)<\/h1>/);
    const name = cardNameMatch?.[1]?.trim() || "";

    // Extract image URL and convert to full URL
    const cardImageMatch = html.match(
      /<div class="cardImage">\s*<img src=\s*"([^"]+)"[^>]*>/,
    );
    let imageUrl = cardImageMatch?.[1]?.trim() || "";
    
    // Convert relative URL to absolute URL
    if (imageUrl && imageUrl.startsWith("../")) {
      imageUrl = `https://www.gundam-gcg.com/en/${imageUrl.replace(/^\.\.\//, "")}`;
    }

    // Extract all data fields
    const dataFields: Record<string, string> = {};
    const dataBoxMatches = html.matchAll(
      /<dl class="dataBox[^"]*">\s*<dt class="dataTit">([^<]+)<\/dt>\s*<dd class="dataTxt[^"]*">([^<]+)<\/dd>\s*<\/dl>/g,
    );

    for (const match of dataBoxMatches) {
      const key = match[1].trim();
      const value = match[2].trim();
      dataFields[key] = value;
    }

    // Extract effect text and normalize line breaks
    const effectMatch = html.match(
      /<div class="cardDataRow overview">\s*<div class="dataTxt isRegular">\s*(.*?)\s*<\/div>/s,
    );
    let effectText = effectMatch?.[1]?.trim().replace(/<br>/g, "\n") || "";
    
    // Remove trailing line breaks
    effectText = effectText.replace(/\n+$/, "");

    return {
      cardNumber,
      rarity,
      name,
      level: dataFields["Lv."] || "",
      cost: dataFields["COST"] || "",
      color: dataFields["COLOR"] || "",
      cardType: dataFields["TYPE"] || "",
      effectText,
      zone: dataFields["Zone"] || "",
      trait: dataFields["Trait"] || "",
      link: dataFields["Link"] || "",
      ap: dataFields["AP"] || "",
      hp: dataFields["HP"] || "",
      sourceTitle: dataFields["Source Title"] || "",
      imageUrl,
    };
  } catch (error) {
    console.error("Error parsing HTML:", error);
    return null;
  }
}

/**
 * Scrapes all cards in a set by trying sequential numbers
 */
export async function scrapeSet(setCode: string): Promise<ScrapedCardData[]> {
  console.log(`\n🔍 Scraping all cards in set: ${setCode}`);
  console.log("=".repeat(50));

  const cards: ScrapedCardData[] = [];
  let currentNumber = 1;
  let consecutiveFailures = 0;
  const maxConsecutiveFailures = 3;

  while (consecutiveFailures < maxConsecutiveFailures) {
    const cardNumber = `${setCode}-${currentNumber.toString().padStart(3, "0")}`;
    console.log(`\n🔍 Attempting: ${cardNumber}`);

    const card = await scrapeCard(cardNumber);
    
    if (card) {
      cards.push(card);
      consecutiveFailures = 0;
      console.log(`✅ Success: ${cardNumber} - ${card.name}`);
    } else {
      consecutiveFailures++;
      console.log(
        `❌ Failed: ${cardNumber} (${consecutiveFailures}/${maxConsecutiveFailures})`,
      );
    }

    currentNumber++;

    // Add delay to avoid overwhelming server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Scraping complete for set ${setCode}`);
  console.log(`✅ Successfully scraped ${cards.length} cards`);

  return cards;
}

