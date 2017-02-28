import { Component, AfterViewInit } from '@angular/core';
import { TdDialogService } from '@covalent/core';

import { Title }     from '@angular/platform-browser';

import { TdLoadingService } from '@covalent/core';

import { ItemsService, UsersService, ProductsService, AlertsService } from '../../services';

import { multi } from './data';

@Component({
  selector: 'qs-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  viewProviders: [ ItemsService, UsersService, ProductsService, AlertsService ],
})
export class DashboardComponent implements AfterViewInit {

  items: Object[];
  users: Object[];
  products: Object[];
  alerts: Object[];

  //Expandable Panel Demo Component
  expandedEvent(): void{
    console.log("You just Expanded the Component");
  }

  collapsedEvent(): void{
    console.log("You just Collapsed the component");
  }
  //End Expandable Demo Component

  //Dialog Box Demo Component
  openAlert(): void {
    this._dialogService.openAlert({
      message: 'This in an Alert Message',
      title: 'Alert',
      closeButton: 'Dismiss',
    });
  }

  openConfirm(): void {
    this._dialogService.openConfirm({
      message: 'Please Confirm Your Trip',
      title: 'Confirm Trip',
      cancelButton: 'Not Today',
      acceptButton: 'Let\'s Pack',
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        console.log("Enjoy Your Trip!")
      } else {
        console.log("See You Soon!")
      }
    });
  }

  openPrompt(): void {
    this._dialogService.openPrompt({
      message: 'Enter Your Favorite Destination',
      title: 'Where Would You Visit?',
      cancelButton: 'Cancel', 
      acceptButton: 'Ok',
    }).afterClosed().subscribe((newValue: string) => {
      if (newValue) {
        console.log("Your Favorite Place is " + newValue);
      } else {
        console.log("Please Enter Something");
      }
    });
  }
  //End Dialog Box Demo Component

  //Loading Component Demo Component
  toggleCustomLoadingMask(): void {
    this._loadingService.register('customLoadingMask');
    let value: number = 0;
    let interval: number = setInterval(() => {
      this._loadingService.setValue('customLoadingMask', value);
      value = value + 10;
      if (value > 100) {
        clearInterval(interval);
      }
    }, 250);
    setTimeout(() => {
      this._loadingService.resolve('customLoadingMask');
    }, 3000);
  }
  //End Loading Component Demo Component

  // Chart
  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Sales';

  colorScheme: any = {
    domain: ['#1565C0', '#2196F3', '#81D4FA', '#FF9800', '#EF6C00'],
  };

  // line, area
  autoScale: boolean = true;

  constructor(private _titleService: Title,
              private _itemsService: ItemsService,
              private _usersService: UsersService,
              private _alertsService: AlertsService,
              private _productsService: ProductsService,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService) {
                // Chart
                this.multi = multi.map((group: any) => {
                  group.series = group.series.map((dataItem: any) => {
                    dataItem.name = new Date(dataItem.name);
                    return dataItem;
                  });
                  return group;
                });
  }

  ngAfterViewInit(): void {
    this._titleService.setTitle( 'Covalent Quickstart' );
    this._loadingService.register('items.load');
    this._itemsService.query().subscribe((items: Object[]) => {
      this.items = items;
      setTimeout(() => {
        this._loadingService.resolve('items.load');
      }, 750);
    }, (error: Error) => {
      this._itemsService.staticQuery().subscribe((items: Object[]) => {
        this.items = items;
        setTimeout(() => {
          this._loadingService.resolve('items.load');
        }, 750);
      });
    });
    this._loadingService.register('alerts.load');
    this._alertsService.query().subscribe((alerts: Object[]) => {
      this.alerts = alerts;
      setTimeout(() => {
        this._loadingService.resolve('alerts.load');
      }, 750);
    });
    this._loadingService.register('products.load');
    this._productsService.query().subscribe((products: Object[]) => {
      this.products = products;
      setTimeout(() => {
        this._loadingService.resolve('products.load');
      }, 750);
    });
    this._loadingService.register('favorites.load');
    this._productsService.query().subscribe((products: Object[]) => {
      this.products = products;
      setTimeout(() => {
        this._loadingService.resolve('favorites.load');
      }, 750);
    });
    this._loadingService.register('users.load');
    this._usersService.query().subscribe((users: Object[]) => {
      this.users = users;
      setTimeout(() => {
        this._loadingService.resolve('users.load');
      }, 750);
    }, (error: Error) => {
      this._usersService.staticQuery().subscribe((users: Object[]) => {
        this.users = users;
        setTimeout(() => {
          this._loadingService.resolve('users.load');
        }, 750);
      });
    });
  }
}
