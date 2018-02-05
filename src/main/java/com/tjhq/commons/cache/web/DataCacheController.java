package com.tjhq.commons.cache.web;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tjhq.commons.cache.service.IDataCacheService;

@Controller
@RequestMapping(value="/dataCache")
public class DataCacheController {
	
	@Resource
	private IDataCacheService dataCacheService;
	
	public IDataCacheService getDataCacheService() {
		return dataCacheService;
	}
	
	public void setDataCacheService(IDataCacheService dataCacheService) {
		this.dataCacheService = dataCacheService;
	}

	@RequestMapping(value="/clearAll")
	@ResponseBody
	public String clearAll() {
		getDataCacheService().clearAll();
		return "Clear Success";
	}
	
	@RequestMapping(value="/clearByProvince")
	@ResponseBody
	public String clearByProvince(String province) {
		getDataCacheService().clear(province);
		return province + " Clear Success";
	}
}
