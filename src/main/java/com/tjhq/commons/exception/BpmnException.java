/**
 * 
 */
package com.tjhq.commons.exception;

/**
 * 流程jar内部异常
 * @author wufucan
 * @version 2015-1-8下午06:07:18
 */
public class BpmnException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String message = "流程包内部错误";
	public BpmnException() {
	}
	public BpmnException(String message) {
		super(message);
		if(message != null && !"".equals(message)){
			this.message = message;
		}
	}
	public BpmnException(Throwable e) {
		super(e);
	}
	public BpmnException(String msg, Throwable e){
		super(msg, e);
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
}
