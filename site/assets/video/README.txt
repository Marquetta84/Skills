Hero background video (optional)
================================

The hero works fine without a video. The poster illustration carries it.

To add one, drop two files in this folder:

  hero.mp4    H.264, yuv420p, no audio track
  hero.webm   VP9, no audio track

Recommended: 1920x1080, 8 to 12 seconds, seamless loop, under 3 MB each.
Slow pans over a finished roof work best. Avoid anything with fast cuts.

The page attaches the video only when all of these are true:
  - the screen is at least 900px wide
  - the visitor has not turned on "reduce motion"
  - the connection is not 2g and Data Saver is off

It fades in once real frames play, so a missing or broken file leaves the
poster in place with no visible error.

Encode with ffmpeg:
  ffmpeg -i source.mov -an -vf scale=1920:-2 -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart hero.mp4
  ffmpeg -i source.mov -an -vf scale=1920:-2 -c:v libvpx-vp9 -crf 36 -b:v 0 hero.webm
