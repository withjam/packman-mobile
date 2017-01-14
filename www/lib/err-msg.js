(function(window, document) {

  var app = angular.module('packman');

  app.directive('errMsg', ErrMsgDirective);

  ErrMsgDirective.$inject = ['$rootScope', '$timeout'];
  function ErrMsgDirective($rootScope, $timeout) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      link: function($scope) {
        $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, err) {
          console.log('state change error', err);
          $scope.error = err.data || err;
          $timeout(function() {
            delete $scope.error;
          }, 2500);
        });
      },
      template: '<div id="error-div" ng-class="{ in: error, out: !error }">{{ error }}</div>'
    }
  }
  


})(window, document);