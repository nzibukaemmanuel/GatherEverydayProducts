import { Component, inject } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { AuthModalService } from '../../core/auth-modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly authModal = inject(AuthModalService);

  cartCount = 2;
  mobileNavOpen = false;

  readonly navLinks = ['New arrivals', 'Kitchen', 'Living', 'Garden', 'Journal'];

  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
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
