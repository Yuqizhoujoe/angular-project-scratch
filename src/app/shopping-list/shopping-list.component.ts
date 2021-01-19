import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private igChangeSub: Subscription;

  constructor(private slService: ShoppingListService) {
  }

  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    this.igChangeSub = this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      );
    let ingredientMap = new Map();
    this.ingredients.forEach(ingredient => {
      if (ingredientMap.has(ingredient.name)) {
        ingredientMap.set(ingredient.name, ingredientMap.get(ingredient.name)+ingredient.amount);
      } else {
        ingredientMap.set(ingredient.name, ingredient.amount);
      }
    });
    let ingredients = [];
    ingredientMap.forEach((value, key) => {
      let ingredient = new Ingredient(key, value);
      ingredients.push(ingredient);
    });
    this.ingredients = ingredients;
  }

  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();
  }

  onEditItem(index: number) {
    this.slService.startedEditedSubject.next(index);
  }
}
