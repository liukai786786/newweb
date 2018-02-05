package com.tjhq.commons.exception.HandlerExceptionResolver;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.InternalResourceView;

import com.tjhq.commons.exception.ServiceException;

@Controller
@RequestMapping(value = "exception")
public class DefaultHandlerExceptionResolver implements HandlerExceptionResolver,Ordered{
	
//	private static Logger logger = LoggerFactory.getLogger(DefaultHandlerExceptionResolver.class);
	
	private int order = HIGHEST_PRECEDENCE;
	
	public int getOrder() {
	    return this.order;
	}

	public ModelAndView resolveException(HttpServletRequest request,HttpServletResponse response, Object handler, Exception ex){
		
		//记录完整的异常信息
//		logger.error("系统异常："+ExceptionUtils.getFullStackTrace(ex));
		
		String exceptionCode = "-1";
		//如果是ServiceException及其子类
		if(ServiceException.class.isAssignableFrom(ex.getClass()))
			exceptionCode = ((ServiceException)ex).getCode();
		
		//记录异常相关信息，返回异常处理页面
		Map<String,String> exceptionModel = new HashMap<String,String>();
		exceptionModel.put("code",exceptionCode);
		exceptionModel.put("msg",ExceptionUtils.getFullStackTrace(ex));
		exceptionModel.put("type",ex.getClass().getName());
		exceptionModel.put("time",DateFormatUtils.format(new Date(),"yyyy-MM-dd HH:mm:ss"));
		ex.printStackTrace();
		if(request.getHeader("x-requested-with")!=null && request.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest")){
			//Ajax请求异常，返回json对象，前端Js回调异常处理函数。
			InternalResourceView view = new InternalResourceView("/exception/ajax.do");
			return new ModelAndView(view,exceptionModel);
		}else{
			//普通业务请求异常，返回自定义异常页面。
			return new ModelAndView("error/error",exceptionModel);
		}
	}
	
	/**
	 * Ajax请求异常，转发Json格式异常信息
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="ajax")
	@ResponseBody
	public Object getTableFactorHead(HttpServletRequest request) throws Exception{
		
		String exceptionCode = (String)request.getAttribute("code");
		String exceptionType = (String)request.getAttribute("type");
		String exceptionMsg = (String)request.getAttribute("msg");
		String time = (String)request.getAttribute("time");
		
		Map<String,String> exception = new HashMap<String,String>();
		exception.put("code",exceptionCode);
		exception.put("type",exceptionType);
		exception.put("msg",exceptionMsg);
		exception.put("time",time);
		Map<String,Object> reponse = new HashMap<String,Object>();
		reponse.put("exception",exception);
		
//		logger.debug("code:"+exceptionCode+"\type:"+exceptionType+"\ttime:"+time+"\n\rmsg:"+exceptionMsg);
		return reponse;
	}
}
