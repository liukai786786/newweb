package com.tjhq.commons.exception;

public class ServiceRuntimeException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	
	
	/**
	 * 异常错误码
	 * Default Value is Undefined Exception
	 */
	private String code = "ERR_00000";
	
	/**
	 * 异常详细信息
	 */
	private String detailMessage;
	

	public String getCode() {
		return code;
	}

	public String getDetailMessage() {
		return detailMessage;
	}
	
	public ServiceRuntimeException(String code, String message) {
		super(code.concat(":").concat(message));
		this.code = code;
	}

}
