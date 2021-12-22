import { AfterViewInit, Component } from '@angular/core';
import { Utilities } from 'src/app/Utilities';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements AfterViewInit {
  private background!: HTMLElement;
  private header!: HTMLElement;

  ngAfterViewInit(): void {
    this.header = document.getElementById('header')!;
    this.background = document.getElementById('hero-bg')!;

    if (Utilities.isMobile() || Utilities.isIpad())
      this.background.style.marginTop = `${this.header.clientHeight}px`;

    this.setResizeListeners();
  }

  setResizeListeners(): void {
    // Maximize hero background on inital load
    this.maximizeHeroBackground();

    // Maximize hero background whenever screen orientation changes
    window.addEventListener('orientationchange', () =>
      this.maximizeHeroBackground()
    );

    // Maximize hero background on resize
    // except for mobile devices due to their resize behavior on scroll
    if (!Utilities.isMobile() && !Utilities.isIpad())
      window.onresize = () => this.maximizeHeroBackground();
  }

  /**
   * Sets the hero background's height to the larger value of the
   * viewport's height without the page header, and the defined min height
   */
  maximizeHeroBackground(): void {
    const minHeight = parseInt(
      window.getComputedStyle(this.background).getPropertyValue('min-height')
    );
    const heightWithoutHeader = window.innerHeight - this.header.clientHeight;

    const height = Math.max(minHeight, heightWithoutHeader);
    this.background.style.height = `${height}px`;
  }
}
