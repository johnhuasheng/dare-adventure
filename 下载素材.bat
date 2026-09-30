@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  DARE 敢于未知 - 下载网页素材
echo  把视频和照片下载到 assets 文件夹（约 45MB），之后不联网也能看视频。
echo.
where curl >nul 2>nul || (echo 没有找到 curl，需要 Windows 10 1803 或更新的系统。 & pause & exit /b)
if not exist "assets\videos" mkdir "assets\videos"
if not exist "assets\images" mkdir "assets\images"
call :get "assets\videos\hero.mp4" "https://videos.pexels.com/video-files/11246371/11246371-hd_1280_720_24fps.mp4"
call :get "assets\videos\dive.mp4" "https://videos.pexels.com/video-files/16430486/16430486-sd_960_540_30fps.mp4"
call :get "assets\videos\climb.mp4" "https://videos.pexels.com/video-files/17270582/17270582-sd_960_540_30fps.mp4"
call :get "assets\videos\glide.mp4" "https://videos.pexels.com/video-files/2328903/2328903-hd_1280_720_25fps.mp4"
call :get "assets\videos\skydive.mp4" "https://videos.pexels.com/video-files/7997334/7997334-hd_1280_720_30fps.mp4"
call :get "assets\videos\alpine.mp4" "https://videos.pexels.com/video-files/11417063/11417063-hd_1280_720_30fps.mp4"
call :get "assets\images\hero.jpg" "https://images.unsplash.com/photo-1563442162585-fa1426255ea9?auto=format&fit=crop&w=2000&q=75"
call :get "assets\images\reveal.jpg" "https://images.unsplash.com/photo-1550992402-9b1fc58fd76d?auto=format&fit=crop&w=2000&q=75"
call :get "assets\images\dive.jpg" "https://images.unsplash.com/photo-1682687982167-d7fb3ed8541d?auto=format&fit=crop&w=1800&q=75"
call :get "assets\images\climb.jpg" "https://images.unsplash.com/photo-1601224748193-d24f166b5c77?auto=format&fit=crop&w=1800&q=75"
call :get "assets\images\glide.jpg" "https://images.unsplash.com/photo-1578312055662-53316197d01e?auto=format&fit=crop&w=1800&q=75"
call :get "assets\images\skydive.jpg" "https://images.unsplash.com/photo-1521673252667-e05da380b252?auto=format&fit=crop&w=1800&q=75"
call :get "assets\images\alpine.jpg" "https://images.unsplash.com/photo-1643903096045-07741be1f245?auto=format&fit=crop&w=1800&q=75"
echo.
echo  完成！双击「启动网页.bat」打开网页，会优先使用本地素材。
echo.
pause
exit /b

:get
if exist "%~1" (echo  已存在 %~1，跳过 & exit /b)
echo  正在下载 %~1 ...
curl -L --fail --retry 2 -s -S -o "%~1" "%~2"
if errorlevel 1 (echo  下载失败：%~1 & del "%~1" 2>nul)
exit /b
