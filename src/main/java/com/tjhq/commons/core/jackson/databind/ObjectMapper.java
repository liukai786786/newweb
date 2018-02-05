package com.tjhq.commons.core.jackson.databind;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.tjhq.commons.exception.ServiceException;
import com.tjhq.commons.exception.core.code.ExceptionCode;

public class ObjectMapper extends com.fasterxml.jackson.databind.ObjectMapper {

	/**
	 * @Fields serialVersionUID : Description
	 */

	private static final long serialVersionUID = 1L;

	public ObjectMapper() {
		super();
		configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	}

	public <T> T readJson(String src, Class<T> valueType) throws ServiceException {
        try {
            return super.readValue(src, valueType);
        } catch (JsonParseException e) {
            e.printStackTrace();
            throw new ServiceException(ExceptionCode.ERR_00000, "JSON解析错误!", false);
        } catch (JsonMappingException e) {
            e.printStackTrace();
            throw new ServiceException(ExceptionCode.ERR_00000, "JSON转换到JAVA对象错误!", false);
        } catch (IOException e) {
            e.printStackTrace();
            throw new ServiceException(ExceptionCode.ERR_00000, "JSON读取错误!", false);
        }
    }
}
