import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isMobile = signal(false);
  sidenavOpened = signal(true);

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).subscribe(result => {
      this.isMobile.set(result.matches);
      this.sidenavOpened.set(!result.matches);
    });
  }

  toggleSidebar(): void {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.sidenavOpened.set(false);
    }
  }
}
