(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json")
.directive('foundItems', FoundItems);


function FoundItems(){
  var ddo = {
    templateUrl: 'list.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'foundController',
    bindToController: true
  };
  return ddo;
}

function FoundItemsDirectiveController(){
  var foundController = this;
  foundController.errorSearch = function() {
    return foundController.items == undefined;
  }
  foundController.emptySearch = function() {
    return foundController.items != undefined && foundController.items.length === 0;
  }
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var controller = this;
  var found = [];

  controller.click = function(){
    if(controller.search === "" || controller.search === " " || controller.search === undefined){
      controller.found = [];
    }else{
      MenuSearchService.getMatchedMenuItems(controller.search).then(function(result){
        controller.found = result;
      })
    }
  };

  controller.removeItem = function(index){
    MenuSearchService.removeItems(index);
  }
}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath){
  var service = this;
  var foundList = [];

  service.getMatchedMenuItems = function(search){
    return $http({
       method: "GET",
       url: (ApiBasePath)
   }).then(function(result){
     var allItems = result.data.menu_items;

     for(var i = 0; i < allItems.length; i++){
        if(allItems[i].description.toLowerCase().indexOf(search.toLowerCase()) >= 0){
          foundList.push(allItems[i]);
        }
     }

     return foundList;
   });
   // var response = $http({
   //   method: "GET",
   //   url: (ApiBasePath)
   // });
   // return response;
 };

  service.removeItems = function(index){
    foundList.splice(index, 1);
  }
}

})();
