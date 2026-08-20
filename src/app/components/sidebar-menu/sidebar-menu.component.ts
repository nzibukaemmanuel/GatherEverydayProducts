import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { MENU_SECTIONS } from '../../data/menu.data';
import { MenuSection } from '../../models/catalog.models';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [IconComponent, RouterLink],
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

  categoryPath(section: MenuSection): string[] {
    if (!section.categorySlug) return [];
    return section.categorySlug === 'new-arrivals' ? ['/new-arrivals'] : ['/category', section.categorySlug];
  }

  /** Sections with no matching category just toggle their dropdown (or close the menu if they have no sub-links either). */
  onRowClick(section: MenuSection): void {
    if (section.categorySlug) return;
    if (!section.links?.length) {
      this.close();
      return;
    }
    this.toggleExpand(section);
  }

  toggleExpand(section: MenuSection): void {
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
