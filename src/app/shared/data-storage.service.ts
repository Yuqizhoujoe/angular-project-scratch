import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Recipe} from '../recipes/recipe.model';
import {RecipeService} from '../recipes/recipe.service';
import {map, tap} from 'rxjs/operators';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Ingredient} from './ingredient.model';

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {

    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private shoppingListService: ShoppingListService
        ) {
    }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put(
            'https://joe-learn-angular-udemy.firebaseio.com/recipes.json',
            recipes
        ).subscribe(response => {
            console.log(response);
        });
    }


    fetchRecipes() {
        return this.http.get<Recipe[]>('https://joe-learn-angular-udemy.firebaseio.com/recipes.json')
            .pipe(
                map(recipes => {
                return recipes.map(recipe => {
                   return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                })
            }),
                tap((recipes: Recipe[]) => {
                    this.recipeService.setRecipes(recipes);
            }));
    }

    fetchIngredients() {
        return this.http.get<Ingredient[]>('https://joe-learn-angular-udemy.firebaseio.com/ingredients/json')
            .pipe(
                tap((ingredients: Ingredient[]) => {
                    this.shoppingListService.setIngredients(ingredients);
                }));
    }

    storeIngredients() {
        const ingredients = this.shoppingListService.getIngredients();
        this.http.put('https://joe-learn-angular-udemy.firebaseio.com/ingredients/json', ingredients)
            .subscribe(response => {
               console.log(response);
            });
    }
}
