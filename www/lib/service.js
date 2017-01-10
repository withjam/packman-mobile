(function(window, document) {

  var app = angular.module('packman');

  app.provider('packmanService', PackmanService);


  function PackmanService() {
    var apiUrl = 'https://packman.withjam.com';

    this.setUrl = function(setUrl) {
      apiUrl = setUrl;
    }

    this.$get = [ '$http', function($http) {

      var service = {};

      service.get = function(path) {
        return $http.get(apiUrl + path);
      }

      service.put = function(path, data) {
        return $http.put(apuUrl + path, data);
      }

      service.post = function(path, data) {
        console.log('service post', path);
        return $http.post(apiUrl + path, data);
      }

      service.getApiUrl = function() {
        return apiUrl;
      }

      return service;

    }];

  }  


})(window, document);