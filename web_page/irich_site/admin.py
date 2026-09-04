from django.contrib import admin
from django.utils.html import format_html
from .models import Service, Project, Banner

admin.site.site_header = "IRICH Control Centre"
admin.site.site_title = "IRICH Admin"
admin.site.index_title = "Manage your website content"


class ImagePreviewAdmin(admin.ModelAdmin):
    readonly_fields = ("image_preview",)

    @admin.display(description="Image")
    def image_preview(self, obj):
        if obj and obj.image:
            return format_html(
                '<img src="{}" alt="" style="width: 96px; height: 64px; '
                'object-fit: cover; border-radius: 10px;" />',
                obj.image.url,
            )
        return "No image uploaded"


@admin.register(Banner)
class BannerAdmin(ImagePreviewAdmin):
    list_display = ("title", "active", "image_preview")
    list_filter = ("active",)
    search_fields = ("title", "subtitle")
    list_editable = ("active",)
    fields = ("title", "subtitle", "image", "image_preview", "active")


@admin.register(Service)
class ServiceAdmin(ImagePreviewAdmin):
    list_display = ("name", "image_preview")
    search_fields = ("name", "description")
    fields = ("name", "description", "image", "image_preview")


@admin.register(Project)
class ProjectAdmin(ImagePreviewAdmin):
    list_display = ("title", "image_preview")
    search_fields = ("title", "description")
    fields = ("title", "description", "image", "image_preview")
