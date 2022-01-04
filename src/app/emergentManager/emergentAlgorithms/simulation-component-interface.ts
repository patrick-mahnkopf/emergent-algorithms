export interface ISimulationComponent {
  init(): void;
  unloadResources(): void;
  update(timeStamp: DOMHighResTimeStamp): void;
  toggleFullscreen(): void;
  onTouch(event: Event): void;
}
