import { Router } from 'itty-router';
import {
  igdl,
  ttdl,
  twitter,
  youtube,
  fbdown,
  capcut,
  gdrive,
  pinterest,
  douyin,
  xiaohongshu,
  xiaohongshuProfile,
  snackvideo,
  cocofun,
  spotify,
  soundcloud,
  threads,
  kuaishou,
  yts
} from 'btch-downloader';

// 定义环境变量接口
interface Env {
  BACKEND_URL: string;
  LOG_LEVEL: string;
  CACHE_STORE: KVNamespace;
}

// 定义请求类型
interface CustomRequest extends Request {
  url: string;
}

// 创建路由器
const router = Router<CustomRequest>();

// ============================================
// 日志工具
// ============================================
class Logger {
  static log(level: 'info' | 'error' | 'warn' | 'debug', message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const log = { timestamp, level, message, ...(data && { data }) };
    console.log(JSON.stringify(log));
  }

  static info(message: string, data?: any) {
    this.log('info', message, data);
  }

  static error(message: string, data?: any) {
    this.log('error', message, data);
  }

  static warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  static debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
}

// ============================================
// 缓存管理
// ============================================
class CacheManager {
  static async get(cache: KVNamespace, key: string) {
    try {
      const data = await cache.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      Logger.error('Cache get error', { key, error: String(error) });
      return null;
    }
  }

  static async set(cache: KVNamespace, key: string, value: any, ttl: number = 3600) {
    try {
      await cache.put(key, JSON.stringify(value), { expirationTtl: ttl });
    } catch (error) {
      Logger.error('Cache set error', { key, error: String(error) });
    }
  }

  static generateKey(platform: string, url: string): string {
    return `${platform}:${Buffer.from(url).toString('base64')}`;
  }
}

// ============================================
// 通用响应处理
// ============================================
const createResponse = (data: any, status: number = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=300',
    },
  });
};

const errorResponse = (message: string, status: number = 400) => {
  return createResponse(
    {
      status: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    status
  );
};

// ============================================
// 路由处理函数
// ============================================

// Instagram 下载
router.get('/api/instagram', async (req: Request, env: Env) => {
  try {
    const url = new URL(req.url);
    const mediaUrl = url.searchParams.get('url');
    const useCache = url.searchParams.get('cache') !== 'false';

    if (!mediaUrl) {
      return errorResponse('Missing URL parameter');
    }

    const cacheKey = CacheManager.generateKey('instagram', mediaUrl);

    // 检查缓存
    if (useCache && env.CACHE_STORE) {
      const cached = await CacheManager.get(env.CACHE_STORE, cacheKey);
      if (cached) {
        Logger.info('Cache hit', { platform: 'instagram', url: mediaUrl });
        return createResponse({ ...cached, fromCache: true });
      }
    }

    Logger.info('Fetching Instagram content', { url: mediaUrl });
    const result = await igdl(mediaUrl);

    // 存储到缓存
    if (result.status && env.CACHE_STORE) {
      await CacheManager.set(env.CACHE_STORE, cacheKey, result);
    }

    return createResponse(result);
  } catch (error) {
    Logger.error('Instagram error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// TikTok 下载
router.get('/api/tiktok', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const mediaUrl = url.searchParams.get('url');

    if (!mediaUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching TikTok content', { url: mediaUrl });
    const result = await ttdl(mediaUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('TikTok error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// YouTube 下载
router.get('/api/youtube', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const mediaUrl = url.searchParams.get('url');

    if (!mediaUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching YouTube content', { url: mediaUrl });
    const result = await youtube(mediaUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('YouTube error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// Facebook 下载
router.get('/api/facebook', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const mediaUrl = url.searchParams.get('url');

    if (!mediaUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching Facebook content', { url: mediaUrl });
    const result = await fbdown(mediaUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('Facebook error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// Twitter/X 下载
router.get('/api/twitter', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const mediaUrl = url.searchParams.get('url');

    if (!mediaUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching Twitter content', { url: mediaUrl });
    const result = await twitter(mediaUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('Twitter error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// CapCut 下载
router.get('/api/capcut', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const templateUrl = url.searchParams.get('url');

    if (!templateUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching CapCut content', { url: templateUrl });
    const result = await capcut(templateUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('CapCut error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// Google Drive 下载
router.get('/api/gdrive', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const fileUrl = url.searchParams.get('url');

    if (!fileUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching Google Drive file', { url: fileUrl });
    const result = await gdrive(fileUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('Google Drive error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// Pinterest 下载或搜索
router.get('/api/pinterest', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q') || url.searchParams.get('url');

    if (!query) {
      return errorResponse('Missing query or URL parameter');
    }

    Logger.info('Fetching Pinterest content', { query });
    const result = await pinterest(query);
    return createResponse(result);
  } catch (error) {
    Logger.error('Pinterest error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// Douyin 下载
router.get('/api/douyin', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const mediaUrl = url.searchParams.get('url');

    if (!mediaUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching Douyin content', { url: mediaUrl });
    const result = await douyin(mediaUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('Douyin error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// 小红书下载
router.get('/api/xiaohongshu', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const mediaUrl = url.searchParams.get('url');

    if (!mediaUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching Xiaohongshu content', { url: mediaUrl });
    const result = await xiaohongshu(mediaUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('Xiaohongshu error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// 小红书用户信息
router.get('/api/xiaohongshu-profile', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const profileUrl = url.searchParams.get('url');

    if (!profileUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching Xiaohongshu profile', { url: profileUrl });
    const result = await xiaohongshuProfile(profileUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('Xiaohongshu profile error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// SnackVideo 下载
router.get('/api/snackvideo', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const mediaUrl = url.searchParams.get('url');

    if (!mediaUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching SnackVideo content', { url: mediaUrl });
    const result = await snackvideo(mediaUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('SnackVideo error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// Cocofun 下载
router.get('/api/cocofun', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const mediaUrl = url.searchParams.get('url');

    if (!mediaUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching Cocofun content', { url: mediaUrl });
    const result = await cocofun(mediaUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('Cocofun error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// Spotify 下载
router.get('/api/spotify', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const trackUrl = url.searchParams.get('url');

    if (!trackUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching Spotify track', { url: trackUrl });
    const result = await spotify(trackUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('Spotify error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// SoundCloud 下载
router.get('/api/soundcloud', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const trackUrl = url.searchParams.get('url');

    if (!trackUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching SoundCloud track', { url: trackUrl });
    const result = await soundcloud(trackUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('SoundCloud error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// Threads 下载
router.get('/api/threads', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const postUrl = url.searchParams.get('url');

    if (!postUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching Threads post', { url: postUrl });
    const result = await threads(postUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('Threads error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// Kuaishou 下载
router.get('/api/kuaishou', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const videoUrl = url.searchParams.get('url');

    if (!videoUrl) {
      return errorResponse('Missing URL parameter');
    }

    Logger.info('Fetching Kuaishou video', { url: videoUrl });
    const result = await kuaishou(videoUrl);
    return createResponse(result);
  } catch (error) {
    Logger.error('Kuaishou error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// YouTube 搜索
router.get('/api/yts', async (req: Request) => {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return errorResponse('Missing query parameter');
    }

    Logger.info('Searching YouTube', { query });
    const result = await yts(query);
    return createResponse(result);
  } catch (error) {
    Logger.error('YouTube search error', { error: String(error) });
    return errorResponse(error instanceof Error ? error.message : 'Unknown error', 500);
  }
});

// 健康检查
router.get('/health', async () => {
  return createResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API 文档
router.get('/api/docs', async () => {
  const docs = {
    name: 'btch-downloader Workers API',
    version: '1.0.0',
    baseUrl: 'https://your-worker.workers.dev',
    endpoints: [
      { path: '/api/instagram?url=<url>', description: 'Download Instagram Reels/Posts/TV' },
      { path: '/api/tiktok?url=<url>', description: 'Download TikTok videos' },
      { path: '/api/youtube?url=<url>', description: 'Download YouTube videos' },
      { path: '/api/facebook?url=<url>', description: 'Download Facebook videos' },
      { path: '/api/twitter?url=<url>', description: 'Download Twitter/X videos' },
      { path: '/api/capcut?url=<url>', description: 'Download CapCut templates' },
      { path: '/api/gdrive?url=<url>', description: 'Get Google Drive file info' },
      { path: '/api/pinterest?q=<query>&url=<url>', description: 'Download or search Pinterest' },
      { path: '/api/douyin?url=<url>', description: 'Download Douyin videos' },
      { path: '/api/xiaohongshu?url=<url>', description: 'Download Xiaohongshu posts' },
      { path: '/api/xiaohongshu-profile?url=<url>', description: 'Get Xiaohongshu profile info' },
      { path: '/api/snackvideo?url=<url>', description: 'Download SnackVideo' },
      { path: '/api/cocofun?url=<url>', description: 'Download Cocofun posts' },
      { path: '/api/spotify?url=<url>', description: 'Get Spotify track info' },
      { path: '/api/soundcloud?url=<url>', description: 'Download SoundCloud tracks' },
      { path: '/api/threads?url=<url>', description: 'Download Threads posts' },
      { path: '/api/kuaishou?url=<url>', description: 'Download Kuaishou videos' },
      { path: '/api/yts?q=<query>', description: 'Search YouTube videos' },
      { path: '/health', description: 'Health check endpoint' },
      { path: '/api/docs', description: 'API documentation' },
    ],
  };
  return createResponse(docs);
});

// CORS 预检
router.options('*', () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
});

// 404 处理
router.all('*', () => {
  return errorResponse('Endpoint not found. Visit /api/docs for documentation', 404);
});

// ============================================
// Worker 主处理函数
// ============================================
export default {
  fetch: router.handle,
} satisfies ExportedHandler<Env>;
