import {TFT_REGIONS} from "./regions";
import {captureFullScreen, cropFromFull, ScreenOptions} from "./screenReader";
import {readSlotWithCache} from "./ocr";
import {listDisplays} from "./listDisplays";

async function readShopOnce(screen: ScreenOptions) {
    console.time("readShopOnce");
    const entries = Object.entries(TFT_REGIONS.shop);
    entries.push(["gold", TFT_REGIONS.gold]);
    entries.push(["xp", TFT_REGIONS.xp]);
    entries.push(["lvl", TFT_REGIONS.lvl]);
    entries.push(["round", TFT_REGIONS.round]);
    const full = await captureFullScreen();
    const cropPromises = entries.map(([slotName, region]) =>
        cropFromFull(region, full, screen)
            .then(buffer => [slotName, buffer] as const)
    );
    const cropped = await Promise.all(cropPromises);
    const ocrPromises = cropped.map(([slotName, buffer]) =>
        readSlotWithCache(slotName, buffer)
            .then(text => [slotName, text] as const)
            .catch(e => [slotName, `ERR: ${(e as Error).message}`] as const)
    );
    const resolved = await Promise.all(ocrPromises);

    const results: Record<string, string> = Object.fromEntries(resolved);

    console.clear();
    console.timeEnd("readShopOnce");
    console.log(new Date().toISOString());
    console.table(results);
}

async function main() {
    const screen = await listDisplays();
    setInterval(() => {
        void readShopOnce(screen);
    }, 1000);
}

main().catch((err) => {
    console.error("Fatal error:", err);
});
