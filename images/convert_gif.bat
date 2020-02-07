ffmpeg.exe -y -i rotating_trefoil.gif -vcodec libx264 -pix_fmt yuv420p -an -preset slow -crf 24 -g 25 rotating_trefoil.mp4
ffmpeg.exe -y -i rotating_trefoil.gif rotating_trefoil.avi
ffmpeg.exe -y -i rotating_trefoil.gif rotating_trefoil.webm
copy /y rotating_trefoil.mp4 D:\wamp\www\pm1nps\courses\MAS344\images\rotating_trefoil.mp4
copy /y rotating_trefoil.avi D:\wamp\www\pm1nps\courses\MAS344\images\rotating_trefoil.avi
copy /y rotating_trefoil.webm D:\wamp\www\pm1nps\courses\MAS344\images\rotating_trefoil.webm

ffmpeg.exe -y -i rotating_trefoil_blue.gif -vcodec libx264 -pix_fmt yuv420p -an -preset slow -crf 24 -g 25 rotating_trefoil_blue.mp4
ffmpeg.exe -y -i rotating_trefoil_blue.gif rotating_trefoil_blue.avi
ffmpeg.exe -y -i rotating_trefoil_blue.gif rotating_trefoil_blue.webm
copy /y rotating_trefoil_blue.mp4 D:\wamp\www\pm1nps\courses\MAS344\images\rotating_trefoil_blue.mp4
copy /y rotating_trefoil_blue.avi D:\wamp\www\pm1nps\courses\MAS344\images\rotating_trefoil_blue.avi
copy /y rotating_trefoil_blue.webm D:\wamp\www\pm1nps\courses\MAS344\images\rotating_trefoil_blue.webm

ffmpeg.exe -y -i unwrap1.gif -vcodec libx264 -pix_fmt yuv420p -an -preset slow -crf 24 -g 25 unwrap1.mp4
ffmpeg.exe -y -i unwrap1.gif unwrap1.avi
ffmpeg.exe -y -i unwrap1.gif unwrap1.webm
copy /y unwrap1.mp4 D:\wamp\www\pm1nps\courses\MAS344\images\unwrap1.mp4
copy /y unwrap1.avi D:\wamp\www\pm1nps\courses\MAS344\images\unwrap1.avi
copy /y unwrap1.webm D:\wamp\www\pm1nps\courses\MAS344\images\unwrap1.webm
