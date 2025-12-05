import {ScreenRegion} from "../regions";
import {Button, mouse, Point, sleep} from "@nut-tree-fork/nut-js";
import {ScreenParameters} from "../ScreenParameters";
import {clamp, randomNormal} from "./randomUtils";

/**
 * Fixe une vitesse de souris tirée selon une loi normale autour de 800,
 * bornée entre 400 et 1400.
 */
function applyRandomMouseSpeed(): void {
    const speed = randomNormal(800, 150); // moyenne 800, écart-type 150
    mouse.config.mouseSpeed = clamp(Math.round(speed), 400, 1400);
}

/**
 * Centre géométrique d'une région.
 */
function regionCenter(region: ScreenRegion): Point {
    const x = (region.left * ScreenParameters.SCREEN_PARAMETERS.width + (region.width * ScreenParameters.SCREEN_PARAMETERS.width / 2))+ScreenParameters.SCREEN_PARAMETERS.left;
    const y = region.top * ScreenParameters.SCREEN_PARAMETERS.height + (region.height * ScreenParameters.SCREEN_PARAMETERS.height / 2);
    return new Point(Math.round(x), Math.round(y));
}

/**
 * Point de clic dans la région :
 * - basé sur le centre
 * - avec un offset tiré selon une loi normale
 * - clampé pour rester dans la région
 */
function samplePointInRegionNormal(region: ScreenRegion): Point {
    const center = regionCenter(region);

    // On prend ~10% de la taille de la région comme écart-type
    const sigmaX = ScreenParameters.SCREEN_PARAMETERS.width * region.width * 0.1;
    const sigmaY = ScreenParameters.SCREEN_PARAMETERS.height * region.height * 0.1;

    let x = center.x + randomNormal(0, sigmaX);
    let y = center.y + randomNormal(0, sigmaY);

    // On reste dans la région
    x = clamp(x,ScreenParameters.SCREEN_PARAMETERS.width * region.left + ScreenParameters.SCREEN_PARAMETERS.left,ScreenParameters.SCREEN_PARAMETERS.width * (region.left + region.width) + ScreenParameters.SCREEN_PARAMETERS.left);
    y = clamp(y, ScreenParameters.SCREEN_PARAMETERS.height * region.top, ScreenParameters.SCREEN_PARAMETERS.height *(region.top + region.height));

    return new Point(Math.round(x), Math.round(y));
}

/**
 * Construit un chemin "humain" entre la position actuelle et une cible :
 * - mouvement globalement rectiligne
 * - légère courbure
 * - jitter aléatoire à chaque step
 */
async function buildHumanPathTo(target: Point, steps = 60): Promise<Point[]> {
    const start = await mouse.getPosition();
    const dx = target.x - start.x;
    const dy = target.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

    // Nombre de points & amplitude adaptés à la distance
    const pathSteps = clamp(Math.round(distance / 15), 20, 80);
    const baseAmplitude = clamp(distance * 0.1, 10, 40);

    // Vecteur normal pour courbure
    const nx = -dy / distance;
    const ny = dx / distance;

    const path: Point[] = [];

    for (let i = 1; i <= pathSteps - 1; i++) {
        const t = i / pathSteps;

        // interpolation linéaire
        let x = start.x + dx * t;
        let y = start.y + dy * t;

        // courbure en "S" (sinus)
        const wave = Math.sin(Math.PI * t) * baseAmplitude;

        x += nx * wave;
        y += ny * wave;

        // petit jitter humain
        const jitterAmp = 2 + distance * 0.01; // légèrement plus si long déplacement
        x += randomNormal(0, jitterAmp);
        y += randomNormal(0, jitterAmp);

        path.push(new Point(Math.round(x), Math.round(y)));
    }
    path.push(target);
    return path;
}

/**
 * Déplacement "humain" vers un point :
 * - vitesse aléatoire (loi normale autour de 800)
 * - chemin courbé avec jitter
 */
export async function moveHumanTo(target: Point): Promise<void> {
    applyRandomMouseSpeed();
    const path = await buildHumanPathTo(target);
    await mouse.move(path);
    await sleep(clamp(10+randomNormal(10,5), 0, 50))
}

/**
 * Moves the cursor or pointer to the center of the specified screen region in a human-like manner.
 *
 * @param {ScreenRegion} region - The screen region whose center the cursor should move to.
 * @return {Promise<void>} A promise that resolves when the movement is complete.
 */
export async function humanToRegion(region: ScreenRegion): Promise<void> {
    const target = samplePointInRegionNormal(region);
    await moveHumanTo(target);
}

/**
 * Clique "humain" au sein d'une région :
 * - choisit un point via loi normale autour du centre
 * - déplacement humain
 * - clic gauche
 */
export async function humanRightClickRegion(region: ScreenRegion): Promise<void> {
    await humanToRegion(region);
    await mouse.click(Button.LEFT);
}

/**
 * Simulates a human-like left-click action on a specified screen region.
 *
 * @param {ScreenRegion} region - The screen region where the left-click action should be performed.
 * @return {Promise<void>} A promise that resolves when the left-click action is completed.
 */
export async function humanLeftClickRegion(region: ScreenRegion): Promise<void> {
    await humanRightClickRegion(region);
    await mouse.releaseButton(Button.LEFT);
}

/**
 * Drag & drop humain entre deux régions :
 * - point de départ et d'arrivée tirés via loi normale autour des centres
 * - mouvement courbé avec jitter
 * - vitesse aléatoire autour de 800
 */
export async function humanDragAndDrop(
    from: ScreenRegion,
    to: ScreenRegion
): Promise<void> {
    const start = samplePointInRegionNormal(from);
    const end = samplePointInRegionNormal(to);

    // vitesse aléatoire pour ce drag
    applyRandomMouseSpeed();

    // On se place au point de départ (déplacement humain)
    await moveHumanTo(start);

    // On maintient le bouton gauche
    await mouse.pressButton(Button.LEFT);

    // Trajectoire humaine jusqu'à la destination
    const path = await buildHumanPathTo(end);
    await mouse.move(path);

    // On relâche
    await mouse.releaseButton(Button.LEFT);
}
