import { chromium } from "playwright";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");

async function generateOgImage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
  });

  const port = process.env.PORT || 3000;
  const url = `http://localhost:${port}/foretoken/?position=42`;

  console.log(`Loading page at ${url}...`);
  console.log("Make sure dev server is running with 'pnpm dev'");

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  } catch (error) {
    console.error(
      "Failed to load page. Make sure dev server is running with 'pnpm dev'"
    );
    throw error;
  }

  // Wait for React to render and barcode to appear
  await page.waitForSelector(".barcode-container", { timeout: 10000 });

  // Wait for any animations/transitions
  await page.waitForTimeout(1000);

  // Hide elements we don't want in OG image (wallet button, about box, etc.)
  await page.addStyleTag({
    content: `
      .wallet-toggle, .about-box, .swipe-hint {
        display: none !important;
      }
      .app-header {
        margin-bottom: 2rem;
      }
      body {
        padding: 2rem;
      }
    `,
  });

  const pngPath = resolve(rootDir, "public/og-image.png");
  await page.screenshot({
    path: pngPath,
    type: "png",
    fullPage: false,
  });

  await browser.close();
  console.log("✓ Generated og-image.png");
}

generateOgImage().catch((err) => {
  console.error("Error generating og-image.png:", err);
  process.exit(1);
});
