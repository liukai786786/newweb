package com.tjhq.commons.cache.service;

import java.util.List;

public interface IDataCacheService {
	
	/**
	 * 把数据放入缓存
	 * @param key
	 * @param value
	 * 注：存入缓存的KEY需要遵循以下规则
	 * 项目库缓存以HQ.SPF、预算以HQ.BGT、绩效以HQ.KPI、通用采集以HQ.CDT、业务对象定义以HQ.DICT、通用以HQ.COMM开头
	 * 建议每个模块自己维护一个Map放入缓存中，这样方便清除缓存，也可以防止缓存KEY重复
	 * 具体格式<HQ.BGT, <String key, Object>>
	 * 录入页面定义具体格式<HQ.COMM, <String "INPUT_ANALY", <String tableID, Object resultList>>>
	 */
	void put(String key, Object value);
	
	void put(String [] keys, Object value);
	
	/**
	 * 取缓存数据
	 * @param key
	 * @return
	 */
	Object get(String key);
	
	/**
     * 取缓存数据
     * @param key
     * @return
     */
	Object get(String [] keys);
	
	/**
	 * 清除所有缓存
	 */
	void clearAll();
	
	/**
	 * 清除指定KEY的缓存
	 * @param key
	 */
	void clear(String key);
	
	/**
	 * 对指定的缓存Key进行监听
	 * @param listenerKey 监听的缓存Key
	 * @param listener 数据发生变化回调的类
	 * @return 监听是否添加成功
	 */
	public boolean addChangeListener(String [] listenerKey, IDataChangeListener listener);
	public boolean addChangeListener(List<String []> listenerKeys, IDataChangeListener listener);
	
	/**
	 * 程序控制监听消息
	 * @param listenerKey
	 * @return
	 */
	public void notifyListener(String [] listenerKey, Object data);
	
	
}
