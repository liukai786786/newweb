package com.tjhq.commons.exception.core.message.po;

import java.io.Serializable;

public class ExceptionInfoPO implements Serializable {
	private static final long serialVersionUID = 1L;
	
	
	/**
	 * Default value is sys_guid()
	 */
	private String guid;
	/**
	 * 错误代码
	 */
	private String code;
	/**
	 * 根据错误代码进行简要说明
	 * 是要是说明系统 哪个模块 错误严重程度
	 */
	private String remark;
	/**
	 * 错误简要信息，用于前台用户提示
	 */
	private String message;
	/**
	 * 错误详细信息，提示错误修复说明
	 */
	private String detailMessage;
	
	
	public String getGuid() {
		return guid;
	}
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getDetailMessage() {
		return detailMessage;
	}
	public void setDetailMessage(String detailMessage) {
		this.detailMessage = detailMessage;
	}

	@Override
	public String toString() {
		return code.concat(":").concat(message);
	}
	
	
	
	
}
