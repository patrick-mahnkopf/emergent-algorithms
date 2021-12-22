import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {
  private prevScrollPos;

  private header: HTMLElement;
  private linkWrapper: HTMLElement;
  private hiddenClass = 'hidden';
  private visibleClass = 'block';
  private modal: HTMLElement;
  private hamburger: HTMLElement;
  private prevURL;

  ngAfterViewInit(): void {
    this.header = document.getElementById('header');
    this.linkWrapper = document.getElementById('nav-links');
    this.modal = document.getElementById('modal');
    this.hamburger = document.getElementById('hamburger');

    this.prevScrollPos = window.scrollY;
    this.prevURL = window.location.href;
    window.onscroll = () => this.onScroll();

    this.modal.onclick = () => this.toggleNavLinks(true);
  }

  // Hide header when scrolling down, show when scrolling up
  onScroll(): void {
    const currentScrollPos = window.scrollY;

    // Return early if not scrolled past header yet, but make sure header is visible
    if (currentScrollPos <= this.header.clientHeight) {
      this.showHeader();
      return;
    }

    // Don't hide header when hamburger menu is open
    if (!this.hasClass(this.linkWrapper, 'hidden')) {
      this.prevScrollPos = currentScrollPos;
      return;
    }

    // Hide header when jumping to anchors, independent of direction
    if (window.location.href != this.prevURL) {
      this.prevURL = window.location.href;
      this.prevScrollPos = currentScrollPos;

      this.hideHeader();
      return;
    }

    // Return early if scroll distance too low
    const minScroll = 10;
    if (Math.abs(currentScrollPos - this.prevScrollPos) < minScroll) return;

    // Show header when scrolling down
    if (this.prevScrollPos > currentScrollPos) this.showHeader();
    // Hide header when scrolling up
    else this.hideHeader();

    this.prevScrollPos = currentScrollPos;
  }

  showHeader(): void {
    this.header.style.top = '0';
  }

  hideHeader(): void {
    const height = this.header.clientHeight;
    this.header.style.top = `-${height}`;
  }

  // Show/Hide header nav links
  toggleNavLinks(closeOnly = false): void {
    // Only hide nav links if hamburger menu is visible
    const hamburgerDisplay = window
      .getComputedStyle(this.hamburger)
      .getPropertyValue('display');
    if (hamburgerDisplay == 'none') return;

    // Hide nav links if they are visible
    if (this.hasClass(this.linkWrapper, this.visibleClass))
      this.replaceClass(this.linkWrapper, this.visibleClass, this.hiddenClass);
    // Show nav links if they are hidden and closeOnly is false
    else if (!closeOnly)
      this.replaceClass(this.linkWrapper, this.hiddenClass, this.visibleClass);
  }

  hasClass(element: HTMLElement, className: string): boolean {
    const re = new RegExp('(?:^|\\s)' + className + '(?!\\S)');
    return element.className.match(re) != null;
  }

  removeClass(element: HTMLElement, className: string): void {
    const re = new RegExp('(?:^|\\s)' + className + '(?!\\S)');
    element.className = element.className.replace(re, '');
  }

  addClass(element: HTMLElement, className: string): void {
    element.className += ` ${className}`;
  }

  replaceClass(element: HTMLElement, oldClass: string, newClass: string): void {
    const re = new RegExp('(?:^|\\s)' + oldClass + '(?!\\S)');
    element.className = element.className.replace(re, newClass);
  }
}
