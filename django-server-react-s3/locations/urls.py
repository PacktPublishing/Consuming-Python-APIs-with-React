from django.conf.urls import url, include
from django.urls import path
from rest_framework import routers
from locations import views
from locations.views import BookmarkListView, BookmarkDetailView, BookmarkList,\
    BookmarkDetail, BookmarkViewSet, CommentViewSet, NoteViewSet,\
    SimpleHelloWorld, SimpleHelloPerson, TemplateHelloPerson
from rest_framework.urlpatterns import format_suffix_patterns

router = routers.DefaultRouter()
#
# router.register(r'users', views.UserViewSet)
# router.register(r'groups', views.GroupViewSet)
router.register(r'bookmarks', BookmarkViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'notes', NoteViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('hello1/', SimpleHelloWorld.as_view(), name='hello-view1'),
    path('hello2/<str:name>/', SimpleHelloPerson.as_view(), name='hello-view2'),
    path('hello3/<str:name>/', TemplateHelloPerson.as_view(), name='hello-view3'),
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]

standardview_urlpatters = [
    url(r'^bookmarks_trad_view/$', BookmarkListView.as_view()),
    url(r'^bookmarks_trad_view/(?P<pk>[0-9]+)/$', BookmarkDetailView.as_view()),
    url(r'^bookmarks_class_view/$', BookmarkList.as_view()),
    url(r'^bookmarks_class_view/(?P<pk>[0-9]+)/$', BookmarkDetail.as_view()),
    url(
        r'^bookmarks_viewset/$',
        BookmarkViewSet.as_view({'get': 'list', 'post': 'create'})
    ),
    url(
        r'^bookmarks_viewset/(?P<pk>[0-9]+)/$',
        BookmarkViewSet.as_view(
            {'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}
        )
    ),
]

standardview_urlpatters = format_suffix_patterns(standardview_urlpatters)

urlpatterns += standardview_urlpatters
