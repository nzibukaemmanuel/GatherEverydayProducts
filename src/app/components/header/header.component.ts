import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { AuthModalService } from '../../core/auth-modal.service';
import { ThemeService } from '../../core/theme.service';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { CartDrawerService } from '../../core/cart-drawer.service';

interface NavLink {
  label: string;
  categorySlug?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IconComponent, SidebarMenuComponent, AccountMenuComponent, AsyncPipe, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly authModal = inject(AuthModalService);
  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);
  readonly cartDrawer = inject(CartDrawerService);

  mobileNavOpen = false;
  sidebarOpen = false;
  searchQuery = '';

  readonly navLinks: NavLink[] = [
    { label: 'New arrivals', categorySlug: 'new-arrivals' },
    { label: 'Kitchen', categorySlug: 'kitchen' },
    { label: 'Living', categorySlug: 'living' },
    { label: 'Garden', categorySlug: 'garden' },
    { label: 'Journal' },
  ];

  navPath(link: NavLink): string[] {
    if (!link.categorySlug) return [];
    return link.categorySlug === 'new-arrivals' ? ['/new-arrivals'] : ['/category', link.categorySlug];
  }

  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onSearchSubmit(): void {
    const q = this.searchQuery.trim();
    if (!q) return;
    this.router.navigate(['/search'], { queryParams: { q } });
    this.mobileNavOpen = false;
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
