import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2/database';
import { MenuItem }  from '../models/menuItem.model';
import { Order }  from '../models/order.model';
import { OrderItem }  from '../models/orderItem.model';
import { Restaurant }  from '../models/restaurant.model';
import { RestaurantService } from '../restaurant.service';
import { OrderService } from '../order.service';


@Component({
  selector: 'app-show-menu-items',
  templateUrl: './show-menu-items.component.html',
  styleUrls: ['./show-menu-items.component.css'],
  providers: [RestaurantService, OrderService]
})
export class ShowMenuItemsComponent implements OnInit {

  userKey: string = '1';
  restaurantKey: string;
  orderKey: string;
  restaurantToDisplay: Restaurant;
  menuItems: MenuItem[] = [];
  // currentOrder: Order;
  // orderItems: OrderItem[] = [];
  addedToCart = null;
  


  constructor(private router: Router, private route: ActivatedRoute, private location: Location, private restaurantService: RestaurantService, private orderService: OrderService) { }


  ngOnInit() {

    // this.orderService.getOrders().subscribe(snapshot => {
    //
    // // TODO: add order state
    //
    //   for(let i = 0; i < snapshot.length; i++)
    //     if(snapshot[i].restaurantKey === this.restaurantKey){
    //
    //       //currentOrder = new Order();
    //       orderKey = snapshot[i].$key;
    //       break;
    //     }
    // }


    this.route.params.forEach((urlParameters) => {
      this.restaurantKey = urlParameters['restaurantKey'];
    });

    if (this.restaurantKey) {

    this.restaurantService.getRestaurantByKey(this.restaurantKey).subscribe(dataLastEmittedFromObserver => {
//      let restaurant = dataLastEmittedFromObserver;
      let items: MenuItem[] = [];
console.log(dataLastEmittedFromObserver);
      for(let i = 0; i < dataLastEmittedFromObserver.menuItems.length; i++){
        // let subItems: string[] = [];

        // for(let j = 0; j < dataLastEmittedFromObserver.menuItems[i].menuSubItems.length; j++){
        //   subItems.push(dataLastEmittedFromObserver.menuItems[i].menuSubItems[j]);
        // }
        let newItem = new MenuItem(dataLastEmittedFromObserver.menuItems[i].menuItemName,
                     dataLastEmittedFromObserver.menuItems[i].menuItemCost,
                     dataLastEmittedFromObserver.menuItems[i].preparationTime,
                     dataLastEmittedFromObserver.menuItems[i].menuSubItems);

        items.push(newItem);
        this.menuItems.push(newItem);
        console.log(this.menuItems)
      }
      this.restaurantToDisplay = new Restaurant(
                     dataLastEmittedFromObserver.restaurantName,
                     dataLastEmittedFromObserver.streetAddress,
                     dataLastEmittedFromObserver.hours,
                     dataLastEmittedFromObserver.website,
                     dataLastEmittedFromObserver.cuisine,
                     dataLastEmittedFromObserver.price,
                     dataLastEmittedFromObserver.imageUrl,
                     items);
    });
  }
}
  addToCart(menuItemToAdd: MenuItem){

    let timesAdded=0;
    let key = null;
    let subscription = this.orderService.getOrders().subscribe(snapshot => {

// TODO: add order state

      let order;
      for(let i = 0; i < snapshot.length; i++)
        if(snapshot[i].restaurantKey === this.restaurantKey && snapshot[i].status === 'INCOMPLETED'){
          order = snapshot[i];
          break;
        }

      let newOrderItem = new OrderItem(menuItemToAdd.menuItemName, 1, parseInt(menuItemToAdd.menuItemCost));
      if(order != null){
        let orderItems: OrderItem[] = [];
        if(timesAdded===0){
          console.log('add order items');

          let quantityIncreased = false;
          for(let i=0; i < order.orderItems.length; i++){
            let cost = order.orderItems[i].cost;
            let menuItem = order.orderItems[i].menuItem;
            let quantity = order.orderItems[i].quantity;
            if (menuItem === newOrderItem.menuItem){
              console.log(menuItem);
              quantityIncreased = true;
              quantity++;
            }
            let orderItem = new OrderItem(menuItem, quantity, cost);
            orderItems.push(orderItem);
          }

          if(quantityIncreased === false){
            orderItems.push(newOrderItem);
          }

          console.log(orderItems);

          this.orderService.updateOrderItems(order.$key, orderItems);
          //this.orderService.addOrderItem(order.$key, newOrderItem);

          this.orderService.updateOrderCost(order.$key, order.totalCost + newOrderItem.cost);
          timesAdded++;
        }
      }
      else //if(order == null)
      {
console.log('add new order with items');
        let newOrder = new Order(this.userKey, new Date(), new Date(), this.restaurantKey, [], 0, 'INCOMPLETED');
        newOrder.addNewOrderItem(newOrderItem);
        key = this.orderService.addOrder(newOrder);

      }
      subscription.unsubscribe();
      this.addedToCart = true;
    })
  }
  goToCart() {
    this.router.navigate(['cart'])
  }

}
