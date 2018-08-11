import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ItemListItemViewModel, ItemListViewModel, PagesRoues} from './item-list.view-model';
import {ActivatedRoute, ActivationEnd, Router} from '@angular/router';
import {Observable, SubscriptionLike as ISubscription} from 'rxjs';
import {ItemListFilter, ItemListService} from './item-list.service';
import {ItemDetailsService} from '../item-details/item.details.service';

@Component({
  selector: 'vth-item-list',
  templateUrl: './item-list.component.html'
})
export class ItemListComponent implements OnInit, OnDestroy {

  viewModel: ItemListViewModel = new ItemListViewModel();
  @ViewChild('newItemInput') newItemInput;
  private _routeSubs: ISubscription;
  canHideCss = true;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _itemListService: ItemListService,
              private _itemDetailsService: ItemDetailsService) {
  }

  ngOnInit() {

    this._routeSubs = this._router.events.subscribe(p => {
      if (p instanceof ActivationEnd) {
        const pageParam = this._route.snapshot.params['page'];
        this.refreshView(pageParam);
      }
    });

    // this is called first time
    const page = this._route.snapshot.params['page'];
    this.refreshView(page);
  }

  ngOnDestroy() {
    if (this._routeSubs) {
      this._routeSubs.unsubscribe();
    }
  }

  onClickOutsideInput(event) {
    if (event.className.indexOf('vth-option-panel__container__nav-container__hider') < 0) {
      this.viewModel.isAddNewItemVisible = false;
      this.viewModel.newItem = '';
    }
  }

  onClickItemDetailsOutsideInput(event) {
    if (event.className.indexOf('vth-option-panel__container__nav-container__hider') > 0) {
      return;
    }

    if (this.viewModel.areDetailsVisible && event.className.indexOf('vth-item-list__container__list__list-item') < 0) {
      this.closeDetails();
    }
  }

  onItemClickHandler(event: MouseEvent, item: ItemListItemViewModel) {
    const id = item.id;
    this.viewModel.areDetailsVisible = true;
    this._itemDetailsService.showItemDetails(id);
  }

  onCloseDetailsHandler(event) {
    this.closeDetails();
  }

  private closeDetails() {
    if (!this._itemDetailsService.isDialogPinned) {
      this.viewModel.areDetailsVisible = false;
      this.canHideCss = true;
      this._itemDetailsService.hideItemDetails();
    }
  }

  toggleAddNewItemVisibility(noToggle: boolean = false) {
    if (!noToggle) {
      this.viewModel.isAddNewItemVisible = !this.viewModel.isAddNewItemVisible;
    }

    if (this.viewModel.isAddNewItemVisible) {
      this._itemDetailsService.hideItemDetails();
      const timerId = setTimeout(() => {
        this.newItemInput.nativeElement.focus();
        clearTimeout(timerId);
      }, 200);
    }
  }

  addNewItem(event, isFromActionButton: boolean = false) {
    if (event.code === 'Enter' || isFromActionButton) {
      const newItem = new ItemListItemViewModel({name: this.viewModel.newItem});
      this._itemListService.addItem(newItem).subscribe(p => {
        this.viewModel.items.push(p);
      });

      this.viewModel.newItem = '';
      this.toggleAddNewItemVisibility(true);
    }

    if (event.code === 'Escape' || isFromActionButton) {
      this.viewModel.newItem = '';
      this.toggleAddNewItemVisibility();
    }
  }

  // helper methods

  private refreshView(page: string) {
    const filter = new ItemListFilter();
    const currDate = new Date(Date.now());

    const getData = (data: Observable<ItemListItemViewModel[]>) => {
      const subscription = data.subscribe(p => {
        this.viewModel.items = p;
        if (subscription) {
          subscription.unsubscribe();
        }
      });
    };

    switch (page) {

      default:
      case PagesRoues.PriorityBox:
        filter.date = new Date(Date.UTC(currDate.getFullYear(), currDate.getUTCMonth(), currDate.getUTCDate()));

        this.viewModel.items.splice(0, this.viewModel.items.length);

        // TODO ad filters
        getData(this._itemListService.getItems());
        break;

      case PagesRoues.Inbox:
        this.viewModel.items.splice(0, this.viewModel.items.length);

        // TODO ad filters
        getData(this._itemListService.getItems());
        break;

      case PagesRoues.Projects:
        this.viewModel.items.splice(0, this.viewModel.items.length);

        // TODO ad filters
        getData(this._itemListService.getItems());
        break;

      case PagesRoues.Calendar:
        this.viewModel.items.splice(0, this.viewModel.items.length);
        break;
    }

  }

}

