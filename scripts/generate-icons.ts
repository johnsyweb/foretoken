import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");

async function generateIcons() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const svgPath = join(rootDir, "public/icon.svg");
  const svgContent = readFileSync(svgPath, "utf-8");

  const sizes = [
    { size: 180, name: "apple-touch-icon.png" },
    { size: 192, name: "icon-192.png" },
    { size: 512, name: "icon-512.png" },
    { size: 32, name: "favicon-32x32.png" },
    { size: 16, name: "favicon-16x16.png" },
  ];

  for (const { size, name } of sizes) {
    await page.setViewportSize({ width: size, height: size });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; }
            svg { display: block; width: 100%; height: 100%; }
          </style>
        </head>
        <body>${svgContent}</body>
      </html>
    `;

    await page.setContent(html);

    const screenshot = await page.screenshot({
      type: "png",
      omitBackground: false,
    });

    const outputPath = join(rootDir, "public", name);
    writeFileSync(outputPath, screenshot);
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  await browser.close();
}

generateIcons().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
