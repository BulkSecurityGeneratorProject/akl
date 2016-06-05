'use strict';

angular.module('aklApp', [
    'LocalStorageModule', 'tmh.dynamicLocale', 'pascalprecht.translate',
    'ui.bootstrap', 'ngResource', 'ui.router', 'ngCookies', 'angularFileUpload',
    'angularMoment', 'ui.calendar', 'ckeditor', 'templateCache', 'restangular', 'ngSanitize'
])
    .run(function ($rootScope, $location, $window, $http, $state, $translate,
                   Language, Auth, Principal, amMoment) {

        amMoment.changeLocale('fi');

        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if (Principal.isIdentityResolved()) {
                Auth.authorize();
            }

            Language.getCurrent().then(function (language) {
                $translate.use(language);
            });
        });

        $rootScope.$on('$stateChangeSuccess',  function (event, toState, toParams, fromState, fromParams) {
            $rootScope.previousStateName = fromState.name;
            $rootScope.previousStateParams = fromParams;
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log("State error");
        });
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider,
                      $translateProvider, tmhDynamicLocaleProvider, RestangularProvider) {

        //enable CSRF
        $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('site', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'scripts/components/navbar/navbar.html',
                    controller: 'NavbarController'
                },
                'footer@': {
                    templateUrl: 'scripts/components/footer/footer.html',
                    controller: 'FooterController'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                }]
            }
        });

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{lang}/{part}.json'
        });
        $translateProvider.preferredLanguage('fi');
        $translateProvider.useCookieStorage();
        $translateProvider.useSanitizeValueStrategy('escaped');

        tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage();
        tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');

        // Restangular
        RestangularProvider.setBaseUrl('/akl-service/api');
    })
    .constant('VERSION', '1.0.0')
    .constant('SERVICE_URL', window.location.origin + '/akl-service')
    .constant('SERVICE_PATH', '/akl-service')
    .constant('API_URL', window.location.origin + '/akl-service' + '/api')
    .constant('API_PATH', '/akl-service' + '/api');
