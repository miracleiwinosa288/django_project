from django.shortcuts import render
from .models import Service, Project, Banner


# Create your views here.
def home(request):
    services = Service.objects.all()
    projects = Project.objects.all()
    banners = Banner.objects.filter(active=True)
    context = {
        'services': services,
        'projects': projects,
        'banners': banners,
    }
    return render(request, 'home.html', context)
