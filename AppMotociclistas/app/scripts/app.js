// Ionic Shipper App
'use strict';
angular.module('shipper', ['ionic', 'shipper.controllers', 'shipper.services', 'shipper.models', 'shipper.directives'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
            cordova.plugins.backgroundMode.enable();
            cordova.plugins.backgroundMode.setDefaults({
                title:  'Shipper',
                ticker: 'Shipper esta en ejecución.',
                text:   'No te preocupes, seguimos aqui :)'
            })
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    //punto de inicio de la App
    .state('inicio', {
        url: '/inicio',
        templateUrl: 'templates/inicio.html',
        controller: 'InicioCtrl'
    })
    //Solicitud de Registro
    .state('registrar', {
        url: '/registrar',
        templateUrl: 'templates/registrar.html',
        controller: 'RegistrarCtrl'
    })
    //Inicio de Sesión
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'RegistrarCtrl'
    })
    //Recordar Contraseña
    .state('olvidoContrasena', {
        url: '/olvidoContrasena',
        templateUrl: 'templates/olvidoContrasena.html',
        controller: 'OlvidoContrasenaCtrl'
    })
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
    })
        //Home de la aplicación
        .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        //Perfil
        .state('app.perfil', {
            url: '/perfil',
            views: {
                'menuContent': {
                    templateUrl: 'templates/perfil.html',
                    controller: 'PerfilCtrl'
                }
            }
        })
        //Historial de Pedidos
        .state('app.historialPedidos', {
            url: '/historialPedidos',
            views: {
                'menuContent': {
                    templateUrl: 'templates/historialPedidos.html',
                    controller: 'HistorialPedidosCtrl'
                }
            }
        })
        //Saldo disponible
        .state('app.saldoDisponible', {
            url: '/saldoDisponible',
            views: {
                'menuContent': {
                    templateUrl: 'templates/saldoDisponible.html',
                    controller: 'SaldoDisponibleCtrl'
                }
            }
        })
        .state('app.gamification', {
            url: '/gamification',
            views: {
                'menuContent': {
                    templateUrl: 'templates/gamification.html',
                    controller: 'GamificationCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/inicio');
});

//Inicializamos el módulo de servicios
angular.module('shipper.services', ['ngResource', 'ionic', 'btford.socket-io']);
//Inicializamos el módulo de Controladores
angular.module('shipper.controllers', ['ionic', 'angular-flexslider', 'angularRandomString']);
//Inicializamos el módulo de modelos
angular.module('shipper.models', ['ionic']);
//Inicializamos el módulo de Directivas
angular.module('shipper.directives', []);