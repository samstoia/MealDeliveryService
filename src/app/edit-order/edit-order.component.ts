import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { FirebaseObjectObservable } from 'angularfire2/database';

import { Order } from '../models/order.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
  providers: [OrderService]
})

export class EditOrderComponent implements OnInit {

  orderId: string;
  orderToUpdate;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private orderService: OrderService) {}

  ngOnInit() {
    this.route.params.forEach((urlParameters) => {
      this.orderId = urlParameters['id'];
    });
    this.orderService.getOrderById(this.orderId).subscribe(dataLastEmittedFromObserver => {
      this.orderToUpdate = dataLastEmittedFromObserver;
    })
  }

  goToShowOrderPage() {
      this.router.navigate(['orders']);
  }

  updateOrder(orderToUpdate) {
    if (orderToUpdate.orderKey != "" && orderToUpdate.orderUserKey != "" && Date.parse(orderToUpdate.deliveryDateTime.toString()) != 0 && Date.parse(orderToUpdate.orderDateTime.toString()) != 0 && orderToUpdate.restaurantKey != "" && orderToUpdate.orderDetails.length > 0) {
      this.orderService.updateOrder(orderToUpdate);
      this.goToShowOrderPage();
    } else {
      alert('All fields are required!');
    }
  }
}
