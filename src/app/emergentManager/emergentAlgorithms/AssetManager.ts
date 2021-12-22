import { Injectable } from '@angular/core';

export const BOID_SPRITE = '/assets/emergent_demos/boids/boids.json';
export const ANT_SPRITE = '/assets/emergent_demos/ants/ants.json';

const loader = PIXI.Loader.shared,
  resources = PIXI.Loader.shared.resources;

@Injectable({
  providedIn: 'root',
})
export class AssetManager {
  private readonly assets: string[] = [BOID_SPRITE, ANT_SPRITE];

  loadAssets(callback: () => void): void {
    if (loader.resources[this.assets[0]] != null) {
      callback();
      return;
    }

    loader.add(this.assets).load(callback);
  }

  unloadAssets(): void {
    PIXI.utils.clearTextureCache();
  }

  get boidSprites(): PIXI.Texture[][] {
    const sheet = resources[BOID_SPRITE].spritesheet;
    const sprites: PIXI.Texture[][] = [
      sheet.animations['birdBlue'],
      sheet.animations['birdRed'],
      sheet.animations['birdBrown'],
      sheet.animations['birdWhite'],
    ];

    return sprites;
  }

  get antSprite(): PIXI.Texture[] {
    const sheet = resources[ANT_SPRITE].spritesheet;
    const sprite: PIXI.Texture[] = sheet.animations['ant'];

    return sprite;
  }
}
