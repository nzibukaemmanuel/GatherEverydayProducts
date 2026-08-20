import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { AuthModalService } from './core/auth-modal.service';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AuthModalComponent, CartDrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authModal = inject(AuthModalService);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => {
      const urlTree = this.router.parseUrl(this.router.url);
      const path = urlTree.root.children['primary']?.segments.map((s) => s.path).join('/') ?? '';
      const token = urlTree.queryParams['token'];

      if (path === 'reset-password' && token) {
        this.authService.validateResetToken(token).subscribe({
          next: ({ valid }) => this.authModal.openResetPassword(token, valid),
          error: () => this.authModal.openResetPassword(token, false),
        });
        this.router.navigate(['/'], { replaceUrl: true });
      }
    });
  }
}
