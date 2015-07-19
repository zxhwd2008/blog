(function() {
    'use strict';

    angular.module('appDev').factory('blogMockBackendFactory', blogMockBackendFactory);

    blogMockBackendFactory.$inject = ['$httpBackend', 'blogMockDataFactory', '_'];

    function blogMockBackendFactory($httpBackend, blogMockDataFactory, _) {
        var blogMockData = blogMockDataFactory();
        return {
            activate: activate
        };

        function activate() {
            $httpBackend.whenGET(/app\/.*/).passThrough();
            getBlogLists();
            getBlogCategories();

            function getBlogLists() {
                $httpBackend.whenGET(/\/api\/getBlogLists\/\w*/).respond(function (method, url) {
                    var filteredBlogLists = [],
                        re = /.*\/api\/getBlogLists\/(\w+)/,
                        cid = parseInt(url.replace(re, '$1'), 10);
                    _.each(blogMockData, function(blog) {
                        if (blog.cid === cid) {
                            filteredBlogLists.push(blog);
                        }
                    });
                    return [200, cid !== 0 ? filteredBlogLists : blogMockData];
                });
            }

            function getBlogCategories() {
                var categories = [], cids = [];
                _.each(blogMockData, function(blog) {
                    if (_.indexOf(cids, blog.cid) === -1) {
                        cids.push(blog.cid);
                        categories.push({
                            cid: blog.cid,
                            category: blog.category
                        });
                    }
                });
                $httpBackend.whenGET('/api/getBlogCategories').respond(categories);
            }

        }
    }
}());