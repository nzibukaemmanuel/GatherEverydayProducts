import { Component, inject } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';
import { AuthModalService } from '../../core/auth-modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IconComponent, SidebarMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly authModal = inject(AuthModalService);

  cartCount = 2;
  mobileNavOpen = false;
  sidebarOpen = false;

  readonly navLinks = ['New arrivals', 'Kitchen', 'Living', 'Garden', 'Journal'];

  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  openLogin(): void {
    this.mobileNavOpen = false;
    this.authModal.openLogin();
  }

  openSignup(): void {
    this.mobileNavOpen = false;
    this.authModal.openSignup();
  }
}
