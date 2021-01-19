import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Ingredient} from '../shared/ingredient.model';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ShoppingListService} from './shopping-list.service';
import {DataStorageService} from '../shared/data-storage.service';

@Injectable({
    providedIn: 'root'
})
export class ShoppingListResolverService implements Resolve<Ingredient[]> {

    constructor(
        private shoppingListService: ShoppingListService,
        private dataStorageService: DataStorageService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Ingredient[]> | Promise<Ingredient[]> | Ingredient[] {
        const ingredients = this.shoppingListService.getIngredients();
        if (ingredients.length === 0) {
            return this.dataStorageService.fetchIngredients();
        } else {
            return ingredients;
        }
    }

}
