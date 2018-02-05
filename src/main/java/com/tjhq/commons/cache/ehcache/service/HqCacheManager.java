
package com.tjhq.commons.cache.ehcache.service;

import java.math.BigDecimal;
import java.text.MessageFormat;
import java.util.Iterator;
import java.util.List;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import net.sf.ehcache.config.CacheConfiguration;
import net.sf.ehcache.config.Configuration;
import net.sf.ehcache.config.FactoryConfiguration;
import net.sf.ehcache.config.MemoryUnit;
import net.sf.ehcache.config.Configuration.Monitoring;
import net.sf.ehcache.store.MemoryStoreEvictionPolicy;

public class HqCacheManager {

    public static final String HQ_CACHE_MANAGER = "hqCacheManager";
    public static final String HQ_CACHE_DATA = "hqCacheData";
    static final String GLOB_REMOTECACHE_LIST = "GLOB_REMOTECACHE_LIST";
    static final String HQ_CACHE_SETTING = "hqCacheSetting";

    public HqCacheManager() {

    }

    public void create(String hostName, String port) throws Exception {
        CacheManager.newInstance(getCacheManagerConfiguration(hostName, port)).addCache(
                new Cache(getSettingCacheConfig()));

    }

    public void addManagerPeerProvider(List<String> rmiUrls) {
        CacheManager cacheManager = CacheManager.getCacheManager(HQ_CACHE_MANAGER);
//        String rmiIP = System.getProperty("fasp2.zkserver.dubbohost");

        removeManagerPeerProvider(cacheManager, rmiUrls);

        for (String rmiUrl : rmiUrls) {
//            if (rmiUrl.contains(rmiIP)) {
//                continue;
//            }
            cacheManager.getCacheManagerPeerProviders().get("RMI").registerPeer(rmiUrl);
        }

        putRemoteCacheList(cacheManager, rmiUrls);

    }

    protected void putRemoteCacheList(CacheManager cacheManager, List<String> rmiUrls) {
        cacheManager.getEhcache(HQ_CACHE_SETTING).put(new Element(GLOB_REMOTECACHE_LIST, rmiUrls));
    }

    @SuppressWarnings("unchecked")
    protected List<String> getRemoteCacheList(CacheManager cacheManager) {
        if (cacheManager.getEhcache(HQ_CACHE_SETTING).get(GLOB_REMOTECACHE_LIST) == null) {
            return null;
        }
        return (List<String>) cacheManager.getEhcache(HQ_CACHE_SETTING).get(GLOB_REMOTECACHE_LIST).getObjectValue();
    }

    protected void removeManagerPeerProvider(CacheManager cacheManager, List<String> newRmiUrls) {
        List<String> oldRemoteList = getRemoteCacheList(cacheManager);
        if (oldRemoteList == null) {
            return;
        }
        Iterator<String> iter = oldRemoteList.iterator();
        while (iter.hasNext()) {
            String url = iter.next();
            if (!newRmiUrls.contains(url)) {
                cacheManager.getCacheManagerPeerProviders().get("RMI").unregisterPeer(url);
            }
        }
    }

    @SuppressWarnings("rawtypes")
	protected Configuration getCacheManagerConfiguration(String hostName, String port) {
        Configuration config = new Configuration();
        
        BigDecimal memory = new BigDecimal(Runtime.getRuntime().maxMemory());
        long maxMemory = memory.multiply(new BigDecimal(0.2)).longValue();

        config.name(HQ_CACHE_MANAGER).monitoring(Monitoring.AUTODETECT).dynamicConfig(true)
                .maxBytesLocalHeap(maxMemory , MemoryUnit.BYTES);

        config.addCache(getCacheConfiguration());

        FactoryConfiguration peerListenerFactory = new FactoryConfiguration();
        peerListenerFactory.setClass("net.sf.ehcache.distribution.RMICacheManagerPeerListenerFactory");
        peerListenerFactory.setProperties(MessageFormat.format("hostName={0}, port={1}, socketTimeoutMillis=20000",
                hostName, port));
        config.addCacheManagerPeerListenerFactory(peerListenerFactory);

        FactoryConfiguration peerProviderFactory = new FactoryConfiguration();
        peerProviderFactory.setClass("net.sf.ehcache.distribution.RMICacheManagerPeerProviderFactory");
        peerProviderFactory.setProperties("peerDiscovery=manual,rmiUrls:");
        config.addCacheManagerPeerProviderFactory(peerProviderFactory);

        return config;
    }

    protected CacheConfiguration getCacheConfiguration() {
        CacheConfiguration config = new CacheConfiguration();

        config.name(HQ_CACHE_DATA).eternal(false).timeToIdleSeconds(0).timeToLiveSeconds(0)
                .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.LRU);

        CacheConfiguration.CacheEventListenerFactoryConfiguration cacheEventListenerFactoryConfiguration;
        cacheEventListenerFactoryConfiguration = new CacheConfiguration.CacheEventListenerFactoryConfiguration();
        cacheEventListenerFactoryConfiguration.setClass("net.sf.ehcache.distribution.RMICacheReplicatorFactory");
        // cacheEventListenerFactoryConfiguration.setProperties("replicateAsynchronously=true,replicatePuts=true, replicateUpdates=true,replicateUpdatesViaCopy=false,replicateRemovals=true");
        config.addCacheEventListenerFactory(cacheEventListenerFactoryConfiguration);

        CacheConfiguration.BootstrapCacheLoaderFactoryConfiguration factory = new CacheConfiguration.BootstrapCacheLoaderFactoryConfiguration();
        factory.setClass("net.sf.ehcache.distribution.RMIBootstrapCacheLoaderFactory");
        // factory.setProperties("bootstrapAsynchronously=false");
        config.addBootstrapCacheLoaderFactory(factory);

        return config;
    }

    private CacheConfiguration getSettingCacheConfig() {
        CacheConfiguration config = new CacheConfiguration();

        config.name(HQ_CACHE_SETTING).eternal(false).timeToIdleSeconds(0).timeToLiveSeconds(0).maxBytesLocalHeap(1, MemoryUnit.MEGABYTES)
                .memoryStoreEvictionPolicy(MemoryStoreEvictionPolicy.LRU);

        return config;
    }

}
