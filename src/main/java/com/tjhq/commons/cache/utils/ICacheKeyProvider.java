/**
 * @Title: ICacheKeyProvider.java
 * @Copyright (C) 2016 太极华青
 * @Description:
 * @Revision 1.0 2016-6-1  CAOK
 */
 

package com.tjhq.commons.cache.utils;

/**
 * @ClassName: ICacheKeyProvider
 * @Description: 缓存KEY生成
 * @author: CAOK 2016-6-1 下午01:31:27
 */

public interface ICacheKeyProvider {
    
    /**.
     * 生成新的KEY返回
     * @param oldKeys
     * @return
     * @throws
     */
    String[] getNewKeys(String[] oldKeys);
}
