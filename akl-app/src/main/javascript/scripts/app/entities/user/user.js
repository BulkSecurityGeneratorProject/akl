'use strict';

angular.module('aklApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('users', {
                parent: 'admin',
                url: '/user',
                data: {
                    roles: ['ROLE_ADMIN']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/user/users.html',
                        controller: 'UserController'
                    }
                },
                params: {
                    page: {
                        value: '1',
                        squash: true
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('user');
                        return $translate.refresh();
                    }],
                    users: ['Api', '$stateParams', function (Api, $stateParams) {
                        return Api.all('users').getList({
                            page: $stateParams.page,
                            per_page: 20
                        });
                    }],
                    authorities: ['Api', function (Api) {
                        return Api.all('users').all('authorities').getList();
                    }]
                }
            })
            .state('user', {
                parent: 'entity',
                url: '/user/{id:int}',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/user/user-detail.html',
                        controller: 'UserDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('user');
                        $translatePartialLoader.addPart('rank');
                        return $translate.refresh();
                    }],
                    user: ['$stateParams', 'Api', function($stateParams, Api) {
                        return Api.one('users', $stateParams.id).get();
                    }],
                    steamUser: ['Api', 'user', function (Api, user) {
                        if (user.data.communityId !== null) {
                            return Api.all('steam').all('user').get(user.data.communityId);
                        }
                    }]
                }
            });
    });
