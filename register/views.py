from django import http
from django.views.generic import base as generic_base_views
from django.views.generic import detail as generic_detail_views
from django.views.generic import list as generic_list_views

import forms
import models


class Course(generic_detail_views.DetailView):
    model = models.Course
    context_object_name = 'course'


class Courses(generic_list_views.ListView):
    model = models.Course
    context_object_name = 'courses'


class Group(generic_detail_views.DetailView):
    model = models.Group
    context_object_name = 'group'


class Groups(generic_list_views.ListView):
    model = models.Group
    context_object_name = 'groups'


class Lecture(generic_detail_views.DetailView):
    model = models.Lecture
    context_object_name = 'lecture'


class LecturePresenceChanging(generic_base_views.View):
    def post(self, request, pk):
        try:
            l = models.Lecture.objects.get(id=pk)
        except models.Lecture.DoesNotExist:
            return http.HttpResponse(status=404)
        f = forms.LecturePresence(request.POST)
        if f.is_valid():
            try:
                s = models.Student.objects.get(
                    id=f.cleaned_data['student'],
                    )
            except models.Student.DoesNotExist:
                return http.HttpResponse(status=404)
            if int(f.cleaned_data['value']):
                models.Presence.objects.get_or_create(
                    student=s,
                    lecture=l,
                    )
                return http.HttpResponse(content='1')
            else:
                models.Presence.objects.filter(
                    student=s,
                    lecture=l,
                    ).delete()
                return http.HttpResponse(content='0')
        else:
            return http.HttpResponse(status=400)


class Lectures(generic_list_views.ListView):
    model = models.Lecture
    context_object_name = 'lectures'


class Lecturer(generic_detail_views.DetailView):
    model = models.Lecturer
    context_object_name = 'lecturer'


class Lecturers(generic_list_views.ListView):
    model = models.Lecturer
    context_object_name = 'lecturers'


class Home(generic_base_views.TemplateView):
    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        return {
            'courses': models.Course.objects.all(),
            'groups': models.Group.objects.all(),
            'lecturers': models.Lecturer.objects.all(),
            'students': models.Student.objects.all(),
            }


class Student(generic_detail_views.DetailView):
    model = models.Student
    context_object_name = 'student'


class Students(generic_list_views.ListView):
    model = models.Student
    context_object_name = 'students'
