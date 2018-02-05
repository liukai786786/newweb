/**
 * 
 */
package com.tjhq.commons.dto;

import java.io.Serializable;

/**
 * @author CAOK
 */
public class ResultDTO implements Serializable {

	private static final long serialVersionUID = 8114458393429372849L;
	private boolean success;
	private String rcode;
	private Object rdata;

	public ResultDTO() {

	}

	public ResultDTO(String msg, String rcode) {
		this.success = false;
		this.rdata = msg;
		this.rcode = rcode;
	}

	public ResultDTO(Object rdata) {
		this.success = true;
		this.rdata = rdata;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getRcode() {
		return rcode;
	}

	public void setRcode(String rcode) {
		this.rcode = rcode;
	}

	public Object getRdata() {
		return rdata;
	}

	public void setRdata(Object rdata) {
		this.rdata = rdata;
	}

}
