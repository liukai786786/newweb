package com.tjhq.commons.cache.ehcache.register;

import com.tjhq.commons.cache.context.CacheContext;
import com.tjhq.commons.cache.ehcache.service.HqCacheManager;

public class ZkConfigRegister {

	static {
		try {
			init();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	static void init() throws Exception {
		String rmiIP = "127.0.0.1";
		String rmiPort = "40001";
		
		CacheContext.getInstance().enable();
		//return;

		HqCacheManager cacheManager = new HqCacheManager();
		cacheManager.create(rmiIP, rmiPort);
		
		/* 注册集群
		HqCacheManager hqCacheManager = new HqCacheManager();
        List<String> rmiUrls = new ArrayList<String>();
        for (String node : currentChilds) {
            rmiUrls.add(zk.readData("/hqcache/" + node).toString());
        }
        
        hqCacheManager.addManagerPeerProvider(rmiUrls);*/

	}

}
