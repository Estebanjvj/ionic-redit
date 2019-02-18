// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

//Se encierra en un closure. Un closure, en JavaScript, hace que las variables puedan ser solo
//locales (privadas)
(function(){var app = angular.module('starter', ['ionic','angularMoment'])

//$scope es una directiva
app.controller('RedditController', function($scope, $http){
  //
  $scope.posts = [
    /*{title:'Titulo'},
    {title:'Titulo 1'},
    {title:'Titulo 2'}*/
  ];
  //get json from Reddit api
  $http.get('https://www.reddit.com/r/popular/new/.json')
    .success( function (posts) {
      //console.log(posts.data.children);
      angular.forEach(posts.data.children, function(posts){
        $scope.posts.push(posts.data);
      });
    });
    //Para el scroll infinito....
    $scope.bottomUpdate = function() {
      //se declaran las variables que van a jugar en el scroll
      var p = {};
      //para este caso se checa si hay post
      if($scope.posts.length > 0) {
        //de ser así, que se guarde el último
        p['after'] = $scope.posts.pop();
      }
      //entonces vuelve a la ruta donde se optienen los datos json de la appi de redit
      //y, para este caso, se le pasa como parametro el name del último post
      $http.get('https://www.reddit.com/r/popular/new/.json',{params:p.name})
        //caso que devuelva algo..
        .success( function (posts) {
          //guarda una lista de posts, como cuando guardabamos los posts directamente de la api
          //anteriormente
          angular.forEach(posts.data.children, function(posts){
            $scope.posts.push(posts.data);
          });
          //se le dice a la función que aqui termina el scroll infinito
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
      //
    };

    $scope.topUpdate = function() {
      //var p = null;
      if($scope.posts.length > 0)
        var p = {'before':$scope.posts[0]};
      else
        return;

      $http.get('https://www.reddit.com/r/popular/new/.json',{params:p.name})
      //caso que devuelva algo
      .success( function (posts) {
        //variable para arreglo de nuevos posts
        var newPosts = [];
        angular.forEach(posts.data.children, function(posts){
          newPosts.push(posts.data);
        });
        $scope.posts = newPosts.concat($scope.posts);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})
}());