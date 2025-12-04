import screenshot from "screenshot-desktop";
import path from "node:path";
import fs from "node:fs";
import {TFT_SCREEN_ID} from "./screenReader";
import sharp = require("sharp");
import {readSlotWithCache} from "./ocr";

async function listDisplays() {
    let buffer: Buffer = await screenshot({ screen: TFT_SCREEN_ID });
    buffer = await sharp(buffer)
        .extract({ left: 950, top: 880, width: 50, height: 30 })
        .grayscale()
        .normalize()
        .png()
        .toBuffer()
    const debugDir = path.join(__dirname, "..", "debug");
    fs.mkdirSync(debugDir, { recursive: true });
    const filePath = path.join(debugDir, "test.png");
    await fs.promises.writeFile(filePath, buffer);
    console.log('texte détecté: ',await readSlotWithCache("test", buffer));
}

listDisplays().catch(console.error);
