package com.tjhq.commons.cache.ehcache.service.impl;

import java.util.HashMap;
import java.util.Map;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;

import org.apache.logging.log4j.LogManager; 
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.tjhq.commons.cache.context.CacheContext;
import com.tjhq.commons.cache.ehcache.service.HqCacheManager;
import com.tjhq.commons.cache.ehcache.service.ICacheService;

@Service("hqCacheService")
public class CacheServiceImpl implements ICacheService {
    
    Logger logger = LogManager.getLogger(CacheServiceImpl.class.getName());
    
    private CacheManager cacheManager;
    
    protected CacheManager getCacheManager() {
        if (cacheManager == null) {
            cacheManager = CacheManager.getCacheManager(HqCacheManager.HQ_CACHE_MANAGER);
        }
        return cacheManager;
    }
    
    protected Cache getCache() {
        return getCacheManager().getCache(HqCacheManager.HQ_CACHE_DATA);
    }
    
    protected Element getElement(String key) {
        Element element = getCache().get(key);
        if (element == null) {
            element = new Element(key, new HashMap<String, Object>());
            getCache().put(element);
        }
        return element;
    }

    @Override
    public void put(String key, Object value) {
    	if (!CacheContext.getInstance().isEnable()) {
    		logger.debug("cache disable .... ");
    		return;
    	}
        if (value == null) {
            value = new HashMap<String, Object>();
        }
        getCache().put(new Element(key, value));
        logger.debug(key + " put cache.");
    }
    
    @Override
    public Element get(String key) {
    	if (!CacheContext.getInstance().isEnable()) {
    		logger.debug("cache disable .... ");
    		return null;
    	}
        return getElement(key);
    }
    
    @SuppressWarnings("unchecked")
    @Override
    public Map<String, Object> getData(String key) {
    	if (!CacheContext.getInstance().isEnable()) {
    		logger.debug("cache disable .... ");
    		return null;
    	}
        return (Map<String, Object>)getElement(key).getObjectValue();
    }
    
    @Override
    public void clearData() {
    	if (!CacheContext.getInstance().isEnable()) {
    		logger.debug("cache disable .... ");
    		return;
    	}
        getCache().removeAll();
        logger.debug("Clear all cache.");
    }
    
}
