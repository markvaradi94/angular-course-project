import {Injectable} from "@angular/core";
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('Kimchi Recipe', 'Stinky yet delicious', 'data:image/jpeg;base64,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',
  //     [new Ingredient('Cabbage', 1),
  //       new Ingredient('Garlic', 2)]),
  //   new Recipe('Ramen Recipe', 'Shoyu Ramen', 'https://pickledplum.com/wp-content/uploads/2018/02/shoyu-ramen-3202.jpg',
  //     [new Ingredient('Soy Sauce', 150), new Ingredient('Nori Sheets', 2)])
  // ];
  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
