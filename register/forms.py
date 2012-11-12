from django import forms


class LecturePresence(forms.Form):
    student = forms.IntegerField()
    value = forms.IntegerField()
