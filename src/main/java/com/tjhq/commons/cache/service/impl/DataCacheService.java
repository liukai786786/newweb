
package com.tjhq.commons.cache.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.logging.log4j.LogManager; 
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.tjhq.commons.cache.context.CacheContext;
import com.tjhq.commons.cache.ehcache.service.ICacheService;
import com.tjhq.commons.cache.service.IDataCacheService;
import com.tjhq.commons.cache.service.IDataChangeListener;
import com.tjhq.commons.cache.utils.CacheUtils;
import com.tjhq.commons.cache.utils.ICacheKeyProvider;

/**
 * Author:CAOK 2015-4-11 下午02:09:16 Version 2.0 Modify 2015-12-15 修改获取Bean获取方式
 */
@Service
public class DataCacheService implements IDataCacheService {

    Logger logger = LogManager.getLogger(DataCacheService.class);

    @Resource(name = "hqCacheService")
    private ICacheService cacheService;

    @Resource
    private ICacheKeyProvider cacheKeyProvider;
    
    /**
     * 用来保存监听者
     */
    private Map<String, List<IDataChangeListener>> listeners = new HashMap<String, List<IDataChangeListener>>();

    public ICacheService getCacheService() {
        return cacheService;
    }

    public void setCacheService(ICacheService cacheService) {
        this.cacheService = cacheService;
    }

    /**
     * @return cacheKeyProvider
     */
    public ICacheKeyProvider getCacheKeyProvider() {
        return cacheKeyProvider;
    }

    /**
     * @param cacheKeyProvider 要设置的 cacheKeyProvider
     */
    public void setCacheKeyProvider(ICacheKeyProvider cacheKeyProvider) {
        this.cacheKeyProvider = cacheKeyProvider;
    }

    @Override
    public void put(String key, Object value) {
    	if (!CacheContext.getInstance().isEnable()) {
    		return;
    	}
        // 对需要缓存的数据进行深度复制，防止后续更改
        Object newValue = CacheUtils.depthClone(value);
        getCacheService().put(key, newValue);
        notifyListener(key, value);
 
    }

    @Override
    public void put(String[] keys, Object value) {
    	if (!CacheContext.getInstance().isEnable()) {
    		return;
    	}
    	
        if (keys == null || keys.length == 0) {
        	logger.debug("当前值不符合缓存Key的要求，系统无法提供缓存服务！");
            return;
        }
        // 对需要缓存的数据进行深度复制，防止后续更改
        Object newValue = CacheUtils.depthClone(value);
        
        // 添加固定前缀 来区分不同地区的用户缓存
        keys = getCacheKeyProvider().getNewKeys(keys);
        String elementKey = getElementKey(keys);
        String [] dataKeys = getDataKeys(keys);
        
        Map<String, Object> data = null;
        if (dataKeys == null || dataKeys.length == 0) {
            getCacheService().put(elementKey, newValue);
        } else {
            data = getCacheService().getData(elementKey);
            CacheUtils.put(data, newValue, getDataKeys(keys));
        }
        
        notifyListener(elementKey, CacheUtils.depthClone(newValue));
    }

    @Override
    public Object get(String key) {
    	if (!CacheContext.getInstance().isEnable()) {
    		return null;
    	}
        return CacheUtils.depthClone(getCacheService().get(key));
    }

    @Override
    public Object get(String[] keys) {
    	if (!CacheContext.getInstance().isEnable()) {
    		return null;
    	}
        // 添加固定前缀 来区分不同地区的用户缓存
        keys = getCacheKeyProvider().getNewKeys(keys);
        return CacheUtils.depthClone(CacheUtils.get(getCacheService().getData(getElementKey(keys)), getDataKeys(keys)));
    }
    
    protected String getElementKey(String[] keys) {
        StringBuilder newKey = new StringBuilder();
        newKey.append(keys[0]).append("/").append(keys[1]).append("/").append(keys[2]);

        return newKey.toString();
    }
    
    protected String [] getDataKeys(String[] keys) {
        if (keys.length <= 3) {
            return new String [0];
        }
        String [] newKeys = new String [keys.length - 3];
        for (int i = 3; i < keys.length; i++ ) {
            newKeys[i-3] = keys[i];
        }
        return newKeys;
    }

    @Override
    public void clear(String key) {
        getCacheService().put(key, null);
        notifyListener(key, null);
    }

    @Override
    public void clearAll() {
        getCacheService().clearData();
        //notifyAllListener(null);
    }
    
    @Override
    public boolean addChangeListener(String [] listenerKey, IDataChangeListener listener) {
        if (logger.isDebugEnabled()) {
            if (listenerKey == null || listenerKey.length == 0 || listener == null) {
                return false;
            }
            
        }
        
        String elementKey = getElementKey(getCacheKeyProvider().getNewKeys(listenerKey));
        List<IDataChangeListener> listenerList = listeners.get(elementKey);
        if (listenerList == null) {
            listenerList = new ArrayList<IDataChangeListener>();
            listeners.put(elementKey, listenerList);
        }
        if(!listenerList.contains(listener)){
        	listenerList.add(listener);
        }       
        return true;
        
    }
    
    @Override
    public boolean addChangeListener(List<String[]> listenerKeys,
    		IDataChangeListener listener) {
    	for (String [] key : listenerKeys) {
    		addChangeListener(key, listener);
    	}
    	return true;
    }
    
    @Override
    public void notifyListener(String[] listenerKey, Object data) {
        notifyListener(getElementKey(listenerKey), data);
    }
    
    protected void notifyListener(String elementKey, Object data) {
        List<IDataChangeListener> listenerList = listeners.get(elementKey);
        if (listenerList == null || listenerList.size() == 0) {
            return;
        }
        
        for (IDataChangeListener listener : listenerList) {
            listener.update(data);
        }
        
    }
    
    protected void notifyAllListener(Object data) {
        for (Map.Entry<String, List<IDataChangeListener>> entry : listeners.entrySet()) {
            for (IDataChangeListener listener : entry.getValue()) {
                listener.update(data);
            }
        }
    }

}
