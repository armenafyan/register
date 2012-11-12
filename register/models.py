# -*- coding: utf-8 -*-
from django.contrib import admin
from django.core import urlresolvers
from django.db import models
from django.utils import timezone


class Course(models.Model):
    class Meta:
        ordering = ['name', ]
        verbose_name = u'предмет'
        verbose_name_plural = u'предметы'
    
    name = models.CharField(max_length=64)
    lecturer = models.ForeignKey('Lecturer', related_name='courses')
    group = models.ForeignKey('Group', related_name='courses')
    beginning = models.DateField()
    end = models.DateField()

    def __unicode__(self):
        return self.get_name()

    def get_name(self):
        return u'%s (поток %s)' % (
            self.name,
            self.group,
            )

    def get_url(self):
        return urlresolvers.reverse(
            'course',
            args=(self.id, )
            )


class Group(models.Model):
    class Meta:
        ordering = ['beginning', ]
        verbose_name = u'поток'
        verbose_name_plural = u'потоки'
    
    beginning = models.DateField()
    end = models.DateField()

    def __unicode__(self):
        return self.get_name()

    def get_lectures(self):
        return Lecture.objects.filter(course__group__exact=self)

    def get_name(self):
        return u'%s–%s' % (
            timezone.localtime(self.beginning).strftime('%Y'),
            timezone.localtime(self.end).strftime('%Y'),
            )

    def get_url(self):
        return urlresolvers.reverse(
            'group',
            args=(self.id, )
            )


class Lecture(models.Model):
    class Meta:
        ordering = ['-time', ]
        verbose_name = u'лекция'
        verbose_name_plural = u'лекции'
    
    course = models.ForeignKey('Course', related_name='lectures')
    time = models.DateTimeField()
    place = models.CharField(max_length=64)

    def __unicode__(self):
        return self.get_name()

    def get_happened(self):
        return timezone.now() > self.time

    def get_name(self):
        return u'%s %s' % (
            self.course,
            timezone.localtime(self.time).strftime('%d.%m.%Y'),
            )

    def get_presence_changing_url(self):
        return urlresolvers.reverse(
            'lecture_presence_changing',
            args=(self.id, ),
            )

    def get_students(self):
        students = self.course.group.students.all()
        present_students = self.course.group.students.filter(was_present_at__exact=self)
        for s in students:
            s.was_present = s in present_students
        return students

    def get_time(self):
        return timezone.localtime(self.time).strftime('%d.%m.%Y, %H:%M')

    def get_url(self):
        return urlresolvers.reverse(
            'lecture',
            args=(self.id, )
            )


class Person(models.Model):
    class Meta:
        abstract = True
        ordering = ['lastname', 'firstname', ]
    
    firstname = models.CharField(max_length=64)
    middlename = models.CharField(max_length=64)
    lastname = models.CharField(max_length=64)

    def __unicode__(self):
        return self.get_fullname()

    def get_fullname(self):
        return u'%s %s %s' % (
            self.firstname,
            self.middlename,
            self.lastname,
            )


class Presence(models.Model):
    class Meta:
        unique_together = ('student', 'lecture', )
    
    student = models.ForeignKey('Student')
    lecture = models.ForeignKey('Lecture')


class Lecturer(Person):
    class Meta:
        verbose_name = u'преподаватель'
        verbose_name_plural = u'преподаватели'

    def get_url(self):
        return urlresolvers.reverse(
            'lecturer',
            args=(self.id, )
            )


class Student(Person):
    class Meta:
        verbose_name = u'студент'
        verbose_name_plural = u'студенты'

    group = models.ForeignKey('Group', related_name='students')
    was_present_at = models.ManyToManyField('Lecture', related_name='students', through='Presence')

    def get_url(self):
        return urlresolvers.reverse(
            'student',
            args=(self.id, )
            )


admin.site.register(Course)
admin.site.register(Student)
admin.site.register(Lecture)
admin.site.register(Lecturer)
admin.site.register(Group)
