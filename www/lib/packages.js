(function(window, document) {

  var app = angular.module('packman');

  app
    .controller('barcodeCtrl', BarcodeCtrl)
    .controller('packageSearchCtrl', PackageSearchCtrl)
    .controller('packageListCtrl', PackageListCtrl)
    .controller('addPackageCtrl', AddPackageCtrl)
    .controller('editPackageCtrl', EditPackageCtrl);


  function BarcodeCtrl($stateParams,$state,packmanService) {
    var ctrl = this;
    ctrl.name = $stateParams.packageName;
    ctrl.root = packmanService.getApiUrl();
    ctrl.done = function() {
      $state.go('barcode', { packageName: ctrl.name });
    }
  }

  PackageSearchCtrl.$inject = ['packmanService','$location','$state','packmanService'];
  function PackageSearchCtrl(packmanService, $location, $state, packmanService) {
    var ctrl = this, s = $location.search();

    ctrl.searchForm = {
      q: s.q
    }

    ctrl.gotoPackage = function(p) {
      $state.go('package', { packageName:  p.name});
    }

    ctrl.doSearch = function() {
      ctrl.searching = true;
      if (ctrl.searchForm.q) {
        packmanService.get('/api/search/packages?q=' + ctrl.searchForm.q).then(function(resp) {
          ctrl.searching = false;
          console.log('search results ', resp);
          ctrl.results = resp.data.results[0];
        }, function(resp) {
          console.log('Error searching', resp);
          alert('There was an error.');
        })
      }
    }

    if (s.q) {
      console.log('do search');
      ctrl.doSearch();
    }
  }

  function PackageListCtrl(data, $state) {
    var ctrl = this;

    console.log('package list', data.packages);

    ctrl.list = data.packages;
    ctrl.viewPackage = function(p) {
      console.log('view package', p);
      $state.go('package', { packageName: p.name });
    }
  }

  function AddPackageCtrl(packmanService, $state) {
    var ctrl = this;
        ctrl.sizes = ['small','medium','large','xlarge'];

    ctrl.title = "Create New Package";
    ctrl.buttonLabel = "Create Package";
    ctrl.formData = {};

    ctrl.submitForm = function() {
      console.log('posting to packmanService');
      packmanService.post('/api/package/0', ctrl.formData).then(function(resp) {
        console.log('create package response', resp);
        $state.go('package', { packageName: resp.data.packages[0].name});
      });
    }
  }

  function EditPackageCtrl(packmanService, $state, data, items) {
    console.log('edit package', data);
    var ctrl = this;
        ctrl.sizes = ['small','medium','large','xlarge'];
    ctrl.title = data.name;
    ctrl.buttonLabel = "Save Changes";
    ctrl.formData = data;
    ctrl.showItems = true;
    ctrl.expandItems = true;
    ctrl.items = items;

    ctrl.printBarcodes = function() {
      $state.go('barcode', { packageName: ctrl.title });
    }

    ctrl.deletePackage = function() {
      if ( confirm('Are you sure you want to delete ' + ctrl.title + '?')) {
        packmanService.delete('/api/package/' + ctrl.title).then(function(resp) {
          console.log('deleted', resp);
          $state.go('packages');
        });
      };
    };

    ctrl.submitForm = function() {
      console.log('posting to packmanService');
      packmanService.post('/api/package/'+ctrl.title, ctrl.formData).then(function(resp) {
        console.log('update package response', resp);
        $state.go('package', { packageName: resp.data.packages[0].name});
      });
    }

    ctrl.addItem = function() {
      ctrl.showItemForm = true;
      ctrl.selectedItem = { id: 0 };
    }

    ctrl.editItem = function(item) {
      ctrl.showItemForm = true;
      ctrl.selectedItem = item;
    }

    ctrl.updateItems = function(itemData) {
      ctrl.showItemForm = false;
      // will pass back an item if a submission
      if (itemData) {
        console.log('got item data');
        // existing items will have package_id
        if (itemData.hasOwnProperty('package_id')) {
          ctrl.selectedItem.name = itemData.name;
          ctrl.selectedItem.body = itemData.body;
        } else {
          ctrl.items.push(itemData);
        }
      }
    }
  }

  
})(window, document);