import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { IconComponent } from '../../components/icon/icon.component';
import { Order, OrdersService } from '../../core/orders.service';

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './order-confirmation-page.component.html',
  styleUrl: './order-confirmation-page.component.css',
})
export class OrderConfirmationPageComponent implements OnInit {
  order: Order | null = null;
  notFound = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ordersService: OrdersService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap((params) => this.ordersService.getById(params.get('id')!)))
      .subscribe({
        next: (order) => (this.order = order),
        error: () => (this.notFound = true),
      });
  }
}
