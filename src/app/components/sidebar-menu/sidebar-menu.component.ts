import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { MENU_SECTIONS } from '../../data/menu.data';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.css',
})
export class SidebarMenuComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  readonly sections = MENU_SECTIONS;
  private readonly expanded = new Set<string>();

  isExpanded(name: string): boolean {
    return this.expanded.has(name);
  }

  toggle(section: { name: string; links?: string[] }): void {
    if (!section.links?.length) {
      this.close();
      return;
    }
    if (this.expanded.has(section.name)) {
      this.expanded.delete(section.name);
    } else {
      this.expanded.add(section.name);
    }
  }

  close(): void {
    this.closed.emit();
  }
}
