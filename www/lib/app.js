(function(window, document) {

  var app = angular.module('packman',['ui.router']);

  app
    .controller('homeCtrl',HomeCtrl)
    .config(PackmanConfig);



  function HomeCtrl($scope,$location) {
    var ctrl = this;

    function codeDetected(data) {
      console.log('code detected', data);
      ctrl.codeFound = data.codeResult.code;
      $scope.$apply();
    }

    function startScanner() {
      Quagga.init({
        locate: true,
        inputStream : {
          name : "Live",
          type : "LiveStream",
          target: '#quaggas-viewport',
          constraints: {
            width: '500',
            height: '500'
          }
        },
        decoder : {
          readers : ["code_128_reader"]
        }
      }, function(err) {
          if (err) {
              console.log(err);
              return
          }
          console.log("Initialization finished. Ready to start");
          Quagga.start();
      });
      Quagga.onDetected(codeDetected);
    }

    ctrl.launchScanner = function() {
      ctrl.scannerActive = true;
      startScanner();
    }

    ctrl.endScanner = function() {
      Quagga.stop();
      ctrl.scannerActive = false;
    }

    ctrl.searchItems = function() {
      console.log('search items', ctrl.itemQ);
      if (ctrl.itemQ) {
        $location.path('search/packages').search('q',ctrl.itemQ);  
      }
    }
    
  }


  PackmanConfig.$inject = ['$stateProvider','$locationProvider'];
  function PackmanConfig($stateProvider,$location) {
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
          data: function($http) {
            return $http.get('/api/packages').then(function(resp) { return resp.data; });
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
        url: '/search/packages',
        templateUrl: 'lib/package.search.html',
        controller: 'packageSearchCtrl as ctrl'
      })
      .state('package', {
        url: '/package/:packageName',
        templateUrl: 'lib/package.form.html',
        resolve: {
          data: function($http, $route) {
            return $http.get('/api/package/' + $route.current.params.packageName).then(function(response) {
              //console.log('response', response.data.package);
              return response.data.package;
            })
          },
          items: function($http, $route) {
            return $http.get('/api/package/' + $route.current.params.packageName + '/items').then(function(response) {
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