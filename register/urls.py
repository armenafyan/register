from django.conf.urls import patterns, include, url
from django.contrib import admin

import views


admin.autodiscover()


urlpatterns = patterns(
    '',
    
    url(r'^$', views.Home.as_view(), name='home'),
    
    url(r'^lecturers/$', views.Lecturers.as_view(), name='lecturers'),
    url(r'^lecturers/(?P<pk>\d+)/$', views.Lecturer.as_view(), name='lecturer'),
    
    url(r'^students/$', views.Students.as_view(), name='students'),
    url(r'^students/(?P<pk>\d+)/$', views.Student.as_view(), name='student'),

    url(r'^courses/$', views.Courses.as_view(), name='courses'),
    url(r'^courses/(?P<pk>\d+)/$', views.Course.as_view(), name='course'),

    url(r'^groups/$', views.Groups.as_view(), name='groups'),
    url(r'^groups/(?P<pk>\d+)/$', views.Group.as_view(), name='group'),

    url(r'^lectures/$', views.Lectures.as_view(), name='lectures'),
    url(r'^lectures/(?P<pk>\d+)/$', views.Lecture.as_view(), name='lecture'),
    url(r'^lectures/(?P<pk>\d+)/presence/$', views.LecturePresenceChanging.as_view(), name='lecture_presence_changing'),
    
    url(
        r'^admin/',
        include(admin.site.urls),
        ),
    )

