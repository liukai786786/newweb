
package com.tjhq.commons.cache.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.HashMap;
import java.util.Map;

public class CacheUtils {

    public static Object get(Object obj, String[] keys) {
        if (keys == null || keys.length == 0) {
            return null;
        }
        Object data = obj;
        for (String key : keys) {
            data = get(data, key);
        }
        return data;
    }

    @SuppressWarnings("unchecked")
    public static Object get(Object obj, String key) {
        if (obj == null || !(obj instanceof HashMap)) {
            return null;
        }
        Map<String, Object> dataMap = (HashMap<String, Object>) obj;
        if (dataMap.containsKey(key)) {
            return dataMap.get(key);
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public static void put(Object obj, Object value, String[] keys) {
        if (keys == null || keys.length == 0) {
            return;
        }
        Map<String, Object> dataMap = (HashMap<String, Object>) obj;
        Map<String, Object> tempMap = dataMap;

        for (int i = 0; i < keys.length; i++) {
            String key = keys[i];
            if (i == (keys.length - 1)) {
                tempMap.put(key, value);
                break;
            }
            if (!tempMap.containsKey(key) || tempMap.get(key) == null) {
                tempMap.put(key, new HashMap<String, Object>());
            }
            tempMap = (Map<String, Object>) tempMap.get(key);
        }
    }

    public static Object depthClone(Object srcObj) {
        Object cloneObj = null;
        ByteArrayOutputStream out = null;
        ObjectOutputStream oo = null;
        ByteArrayInputStream in = null;
        ObjectInputStream oi = null;
        try {
            out = new ByteArrayOutputStream();
            oo = new ObjectOutputStream(out);
            oo.writeObject(srcObj);

            in = new ByteArrayInputStream(out.toByteArray());
            oi = new ObjectInputStream(in);
            cloneObj = oi.readObject();

            out.close();
            oo.close();
            in.close();
            oi.close();

        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        return cloneObj;
    }

}
