import screenshot from "screenshot-desktop";

async function listDisplays() {
    const displays = await screenshot.listDisplays();
    console.log("Écrans détectés :");
    console.log(displays);
}

listDisplays().catch(console.error);
