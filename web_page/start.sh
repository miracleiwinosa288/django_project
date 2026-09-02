#!/usr/bin/env bash
set -o errexit

# A Render disk starts empty. Populate it once with the images committed to
# this repository, while preserving all later uploads made through the admin.
mkdir -p "$MEDIA_ROOT"
if ! find "$MEDIA_ROOT" -type f -print -quit | grep -q .; then
  cp -a media/. "$MEDIA_ROOT"/
fi

exec gunicorn web_page.wsgi:application --bind "0.0.0.0:$PORT"
