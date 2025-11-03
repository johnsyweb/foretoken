import { chromium } from "playwright";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");

async function generateScreenshot() {
  const browser = await chromium.launch();
  // iPhone 14 Pro dimensions (390 x 844, but using standard iPhone screenshot size)
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
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

  const pngPath = resolve(rootDir, "screenshot.png");
  await page.screenshot({
    path: pngPath,
    type: "png",
    fullPage: true,
  });

  await browser.close();
  console.log("✓ Generated screenshot.png");
}

generateScreenshot().catch((err) => {
  console.error("Error generating screenshot:", err);
  process.exit(1);
});
