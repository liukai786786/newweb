package com.tjhq.commons.cache.ehcache.service;

import java.util.Map;

import net.sf.ehcache.Element;

public interface ICacheService {
    
    public void put(String key, Object value);
    
    public Element get(String key);
    
    public Map<String, Object> getData(String key);
    
    public void clearData();
}
