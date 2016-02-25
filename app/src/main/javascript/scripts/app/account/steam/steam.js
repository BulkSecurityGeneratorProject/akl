'use strict';

angular.module('aklApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('steam', {
                parent: 'account',
                url: '/steam',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.steam'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/account/steam/steam.html',
                        controller: 'SteamController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('steam');
                        return $translate.refresh();
                    }]
                }
            });
    });