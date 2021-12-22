import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BottomUiService {
  private readonly COHERENCE_SLIDER_NAME = 'coherence-slider';
  private readonly SEPARATION_SLIDER_NAME = 'separation-slider';
  private readonly ALIGNMENT_SLIDER_NAME = 'alignment-slider';
  private readonly VISUAL_RANGE_SLIDER_NAME = 'visualRange-slider';
  private readonly MAX_SPEED_SLIDER_NAME = 'maxSpeed-slider';

  private readonly DEFAULT_COHERENCE_WEIGHT = 0.005; // default 0.005
  private readonly DEFAULT_SEPARATION_WEIGHT = 0.05; // default 0.05
  private readonly DEFAULT_ALIGNMENT_WEIGHT = 0.05; // default 0.05
  private readonly DEFAULT_VISUAL_RANGE = 150; // default 150
  private readonly DEFAULT_MAX_SPEED = 5; // default 5

  private UIVariables = new Map<string, number>([
    [this.COHERENCE_SLIDER_NAME, this.DEFAULT_COHERENCE_WEIGHT],
    [this.SEPARATION_SLIDER_NAME, this.DEFAULT_SEPARATION_WEIGHT],
    [this.ALIGNMENT_SLIDER_NAME, this.DEFAULT_ALIGNMENT_WEIGHT],
    [this.VISUAL_RANGE_SLIDER_NAME, this.DEFAULT_VISUAL_RANGE],
    [this.MAX_SPEED_SLIDER_NAME, this.DEFAULT_MAX_SPEED],
  ]);
  private UI_VARIABLES_DEFAULTS = new Map(this.UIVariables);
  private UISliders = new Map<string, HTMLInputElement>();

  initSliders(): void {
    const sliderWrapper = document.getElementById('bottom-ui-slider-wrapper');
    const sliders = sliderWrapper.getElementsByClassName('slider');

    for (let i = 0; i < sliders.length; i++) {
      const slider = sliders[i] as HTMLInputElement;

      if (!this.UISliders.has(slider.id)) {
        this.UISliders.set(slider.id, slider);
      }
    }
  }

  onSliderClicked(event: Event): void {
    const target = event.target as HTMLInputElement;
    const sliderName = target.id;
    const weightModifier = +target.value / 100;
    this.setUIVariableWeightModifier(sliderName, weightModifier);
  }

  private setUIVariableWeightModifier(
    variableName: string,
    weightModifier: number
  ) {
    let newValue =
      this.UI_VARIABLES_DEFAULTS.get(variableName) * 2 * weightModifier;

    if (
      variableName === 'visualRange-slider' ||
      variableName === 'maxSpeed-slider'
    ) {
      newValue = Math.max(1, newValue);
    }

    this.UIVariables.set(variableName, newValue);
  }

  reset(): void {
    this.resetVariables();
    this.resetSliders();
  }

  private resetVariables(): void {
    this.UIVariables = new Map(this.UI_VARIABLES_DEFAULTS);
  }

  private resetSliders(): void {
    this.UISliders.forEach((UISlider) => {
      UISlider.value = '50';
    });
  }

  private getUIVariable(variableName: string): number {
    return this.UIVariables.get(variableName);
  }

  getCoherenceWeight(): number {
    return this.getUIVariable(this.COHERENCE_SLIDER_NAME);
  }

  getSeparationWeight(): number {
    return this.getUIVariable(this.SEPARATION_SLIDER_NAME);
  }

  getAlignmentWeight(): number {
    return this.getUIVariable(this.ALIGNMENT_SLIDER_NAME);
  }

  getVisualRange(): number {
    return this.getUIVariable(this.VISUAL_RANGE_SLIDER_NAME);
  }

  getMaxSpeed(): number {
    return this.getUIVariable(this.MAX_SPEED_SLIDER_NAME);
  }
}
