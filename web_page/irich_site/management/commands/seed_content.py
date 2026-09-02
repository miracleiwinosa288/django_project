from django.core.management import BaseCommand, call_command

from irich_site.models import Banner, Project, Service


class Command(BaseCommand):
    help = "Load the site's starter content into an empty database."

    def handle(self, *args, **options):
        models = (Banner, Service, Project)
        if any(model.objects.exists() for model in models):
            self.stdout.write("Starter content already exists; skipping seed.")
            return

        call_command("loaddata", "initial_content")
        self.stdout.write(self.style.SUCCESS("Starter content loaded."))
