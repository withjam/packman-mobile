(function(window, document) {

  var app = angular.module('packman',['ui.router']);

  app
    .controller('homeCtrl',HomeCtrl)
    .config(PackmanConfig);



  HomeCtrl.$inject = ['$scope', '$state'];
  function HomeCtrl($scope,$state) {
    var ctrl = this;

    function codeDetected(data) {
      console.log('code detected', data);
      ctrl.codeFound = data.codeResult.code;
      $scope.$apply();
    }

    ctrl.launchScanner = function() {
      ctrl.scannerActive = true;
      startScanner();
    }

    ctrl.endScanner = function() {
      ctrl.scannerActive = false;
    }

    ctrl.searchItems = function() {
      console.log('search items', ctrl.itemQ);
      if (ctrl.itemQ) {
        $state.go('search',{ q: ctrl.itemQ });
      }
    }
    
  }


  PackmanConfig.$inject = ['$stateProvider','$locationProvider','packmanServiceProvider'];
  function PackmanConfig($stateProvider,$location,packmanServiceProvider) {
    $location.html5Mode(false);
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'lib/home.html',
        controller: 'homeCtrl as ctrl'
      })
      .state('packages', {
        url: '/packages',
        templateUrl: 'lib/package.list.html',
        resolve: {
          data: function(packmanService) {
            return packmanService.get('/api/packages').then(function(resp) { return resp.data; });
          }
        },
        controller: 'packageListCtrl as ctrl'
      })
      .state('addpackage', {
        url: '/addpackage',
        templateUrl: 'lib/package.form.html',
        controller: 'addPackageCtrl as ctrl'
      })
      .state('search', {
        url: '/search/packages?q',
        templateUrl: 'lib/package.search.html',
        controller: 'packageSearchCtrl as ctrl'
      })
      .state('package', {
        url: '/package/:packageName',
        templateUrl: 'lib/package.form.html',
        resolve: {
          data: function(packmanService, $stateParams) {
            return packmanService.get('/api/package/' + $stateParams.packageName).then(function(response) {
              //console.log('response', response.data.package);
              return response.data.package;
            })
          },
          items: function(packmanService, $stateParams) {
            return packmanService.get('/api/package/' + $stateParams.packageName + '/items').then(function(response) {
              return response.data.items;
            });
          }
        },
        controller: 'editPackageCtrl as ctrl'
      })
      .state('barcode', {
        url: '/package/:packageName/barcodes',
        templateUrl: 'lib/package.barcode.html',
        controller: 'barcodeCtrl as ctrl'
      });

  }


  
})(window, document);