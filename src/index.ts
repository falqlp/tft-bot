import {TFT_REGIONS} from "./regions";
import {captureFullScreen, cropFromFull} from "./screenReader";
import {readSlotWithCache} from "./ocr";

async function readShopOnce() {
    console.time("readShopOnce");
    const entries = Object.entries(TFT_REGIONS.shop);
    const full = await captureFullScreen();
    const cropPromises = entries.map(([slotName, region]) =>
        cropFromFull(region, full)
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
    setInterval(() => {
        void readShopOnce();
    }, 1000);
}

main().catch((err) => {
    console.error("Fatal error:", err);
});
