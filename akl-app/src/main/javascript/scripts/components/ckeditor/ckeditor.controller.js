'use strict';

angular.module('aklApp')
    .controller('CkeditorCtrl', function ($scope, $rootScope, $translate) {
        var lang = $translate.use();
        if (lang === undefined) {
            lang = 'en';
        }

        // Toolbar configs
        var toolbarGroups = [
            { name: 'clipboard', groups: ['clipboard', 'undo'] },
            { name: 'editing', groups: ['find', 'selection'] },
            { name: 'links' },
            { name: 'insert'},
            { name: 'forms' },
            '/',
            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
            { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
            { name: 'styles' },
            { name: 'colors' },
            { name: 'document', groups: ['mode', 'document', 'doctools'] },
            { name: 'tools' },
            { name: 'others', groups: ['ckwebspeech'] }
        ];

        //console.log($scope.content);

        // Editor options.
        $scope.options = {
            //skin: 'bootstrapck,/scripts/components/ckeditor/skins/bootstrapck/',
            //skin: 'flat,/scripts/components/ckeditor/skins/flat/',
            //skin: 'minimalist,/scripts/components/ckeditor/skins/minimalist/',
            language: lang,
            extraPlugins: 'autogrow,widgetbootstrap,base64image,inlinesave,inlinecancel,ckwebspeech,chart,fontawesome,justify,tableresize,colorbutton,youtube',
            toolbarGroups: toolbarGroups,
            disableNativeSpellChecker: true,
            allowedContent: true,
            entities: false,
            disableAutoInline: true,
            inlinesave: {
                postUrl: '/myurl',
                postData: {
                    test: true
                },
                onSave: function(editor) {
                    console.log('clicked save', editor);
                },
                onSuccess: function(editor, data) {
                    console.log('save successful', editor, data);
                },
                onFailure: function(editor, status, request) {
                    console.log('save failed', editor, status, request);
                }
            },
            inlinecancel: {
                onCancel: function(editor) {
                    console.log('cancel', editor);
                }
            },
            ckwebspeech: {
                'culture' : 'fi-FI'
            }
        };

        // Called when the editor is completely ready.
        $scope.onReady = function () {

        };
    });
