import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
})
export class IconComponent {
  /** Name of the icon to render — see icon.component.html for the full list. */
  @Input() name = '';
  /** Square size in pixels. */
  @Input() size = 20;
}
