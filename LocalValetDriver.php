<?php

class LocalValetDriver extends ValetDriver
{
  /**
   * 确定驱动程序是否给请求提供服务。
   *
   * @param  string  $sitePath
   * @param  string  $siteName
   * @param  string  $uri
   * @return bool
   */
  public function serves($sitePath, $siteName, $uri)
  {
    return true;
  }

  /**
   * 确定即将到来的请求是否针对静态文件。
   *
   * @param  string  $sitePath
   * @param  string  $siteName
   * @param  string  $uri
   * @return string|false
   */
  public function isStaticFile($sitePath, $siteName, $uri)
  {
    if (file_exists($staticFilePath = $sitePath . '/dist/' . $uri)) {
      return $staticFilePath;
    }

    return false;
  }

  /**
   * 获取对应用程序的前端控制器的完全解析路径。
   *
   * @param  string  $sitePath
   * @param  string  $siteName
   * @param  string  $uri
   * @return string
   */
  public function frontControllerPath($sitePath, $siteName, $uri)
  {
    return $sitePath . '/dist/index.html';
  }
}
