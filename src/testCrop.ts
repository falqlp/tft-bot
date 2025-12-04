import screenshot from "screenshot-desktop";
import path from "node:path";
import fs from "node:fs";
import {TFT_SCREEN_ID} from "./screenReader";
import sharp = require("sharp");
import {readSlotWithCache} from "./ocr";
import {listDisplays} from "./listDisplays";

async function testCrop() {
    const screen = await listDisplays();
    let buffer: Buffer = await screenshot({ screen: TFT_SCREEN_ID });
    buffer = await sharp(buffer)
        .extract({
            left: Math.floor(screen.width * 0.40),
            top: Math.floor(screen.height * 0.01),
            width: Math.floor(screen.width * 0.022),
            height: Math.floor(screen.height * 0.028),
        })
        .grayscale()
        .normalize()
        .png()
        .toBuffer()
    const debugDir = path.join(__dirname, "..", "debug");
    fs.mkdirSync(debugDir, { recursive: true });
    const filePath = path.join(debugDir, "test.png");
    await fs.promises.writeFile(filePath, buffer);
    console.log('texte détecté:',await readSlotWithCache("test", buffer));
}

testCrop().catch(console.error);
