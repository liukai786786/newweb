/**
 * @Title: CacheKeyProvider.java
 * @Copyright (C) 2016 太极华青
 * @Description:
 * @Revision 1.0 2016-6-1  CAOK
 */

package com.tjhq.commons.cache.utils;

import org.apache.logging.log4j.LogManager; 
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @ClassName: CacheKeyProvider
 * @Description: 缓存KEY生成
 * @author: CAOK 2016-6-1 下午01:34:36 Modify 2017-10-27 10:33
 */
@Service
@Transactional(readOnly = true)
public class CacheKeyProvider implements ICacheKeyProvider {

    Logger logger = LogManager.getLogger(CacheKeyProvider.class);

    /**
     * .
     * <p>
     * Title: getNewKeys
     * </p>
     * <p>
     * Description:
     * </p>
     * @param oldKeys
     * @return
     * @see com.tjhq.commons.cache.utils.ICacheKeyProvider#getNewKeys(java.lang.String[])
     */
    @Override
    public String[] getNewKeys(String[] oldKeys) {
        String[] newKeys = new String[oldKeys.length + 2];
        newKeys[0] = "FRIM";
        newKeys[1] = "2020";

        for (int i = 0; i < oldKeys.length; i++) {
            newKeys[i + 2] = oldKeys[i];
        }
        return newKeys;
    }

}
