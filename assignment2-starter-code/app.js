(function () {
'use strict';

angular.module('ShoppingListApp', [])
.controller('ShoppingListController', ShoppingListController)
.controller('CheckOffListController', CheckOffListController)
.provider('ShoppingListService', ShoppingListServiceProvider)
.config(Config);

Config.$inject = ['ShoppingListServiceProvider'];
function Config(ShoppingListServiceProvider) {
  // Save Yaakov from himself
  ShoppingListServiceProvider.defaults.maxItems = 5;
}

ShoppingListController.$inject = ['ShoppingListService'];
function ShoppingListController(ShoppingListService) {
  var list = this;

  list.items = ShoppingListService.getItems();
  list.itemName = "";
  list.itemQuantity = "";

  list.addItem = function () {
    try {
      ShoppingListService.addItem(list.itemName, list.itemQuantity);
    } catch (error) {
      list.errorMessage = error.message;
    }
  };

  list.addCheckItem = function (itemIndex) {
    ShoppingListService.addCheckItem(itemIndex);
  };


}

CheckOffListController.$inject = ['ShoppingListService'];
function CheckOffListController(ShoppingListService) {
  var check = this;
  check.items = ShoppingListService.getcheckItems();
}


function ShoppingListService(maxItems){
  var service = this;

  var items = [];
  var checkItems = [];

  service.addItem = function (itemName, quantity) {
    if ((maxItems === undefined) ||
        (maxItems !== undefined) && (items.length < maxItems)) {
      var item = {
        name: itemName,
        quantity: quantity
      };
      items.push(item);
    }
    else {
      throw new Error("Max items (" + maxItems + ") reached.");
    }
  };

  service.removeItem = function(itemIndex){
    items.splice(itemIndex,1);
  };

  service.addCheckItem = function(itemIndex){
    if ((maxItems === undefined) ||
        (maxItems !== undefined) && (items.length < maxItems)) {
      var item = {
        name: items[itemIndex].name,
        quantity: items[itemIndex].quantity
      };
      checkItems.push(item);
      console.log(checkItems);
    }
    else {
      throw new Error("Max items (" + maxItems + ") reached.");
    }
    items.splice(itemIndex,1);
  };

  service.getItems = function(){
    return items;
  };

  service.getcheckItems = function(){
    return checkItems;
  };
}

function ShoppingListServiceProvider(){
  var provider = this;

  provider.defaults = {
    maxItems : 5
  };

  provider.$get = function(){
    var ShoppingList = new ShoppingListService(provider.defaults.maxItems);

    return ShoppingList;
  }
};

})();
