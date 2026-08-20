import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { AuthService, AuthUser } from '../../core/auth.service';

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.css',
})
export class AccountMenuComponent {
  @Input({ required: true }) user!: AuthUser;

  open = false;

  constructor(
    private readonly authService: AuthService,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  toggle(): void {
    this.open = !this.open;
  }

  logout(): void {
    this.authService.logout();
    this.open = false;
  }
}
