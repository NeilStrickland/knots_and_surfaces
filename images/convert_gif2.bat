ffmpeg.exe -y -i mobius.gif -vcodec libx264 -pix_fmt yuv420p -an -preset slow -crf 24 -g 25 mobius.mp4
ffmpeg.exe -y -i mobius.gif mobius.avi
ffmpeg.exe -y -i mobius.gif mobius.webm
copy /y mobius.mp4 D:\wamp\www\pm1nps\courses\MAS344\images\mobius.mp4
copy /y mobius.avi D:\wamp\www\pm1nps\courses\MAS344\images\mobius.avi
copy /y mobius.webm D:\wamp\www\pm1nps\courses\MAS344\images\mobius.webm
