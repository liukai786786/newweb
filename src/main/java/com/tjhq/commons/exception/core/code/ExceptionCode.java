package com.tjhq.commons.exception.core.code;

/**
 * Author:CAOK 2015-11-10 上午09:32:52 Version 1.0 Exception Code Define Code
 * Template "INP_00001" INP:DATAINPUT
 * 第一位0表是业务系统0为公共 1为项目库 2为预算 3为基础数据采集 4为绩效系统 5为通用单据系统
 * 第二位0表示业务模块，各业务系统自行划分，合理规划 
 * 第三位0表示错误级别，0为致命错误 1为严重错误 2为一般错误
 * 第四、五位组合使用为错误序列用16进制表示，最大值为FF(255)
 */
public final class ExceptionCode {

	/**
	 * 系统默认错误
	 */
	public static final String ERR_00000 = "ERR_00000";
	/**
	 * 数据库单行返回多行
	 */
	public static final String ERR_00001 = "ERR_00001";
	/**
     * @Fields ERP_00003 : 获取用户信息出错
     */
    public static final String ERR_00002 = "ERR_00002";
	/**
	 * 封装数据报错
	 */
	public static final String ERP_00002 = "ERP_00002";
	
	
	/**
	 * 记账定义规则错误
	 */
	public static final String BDF_00001 = "BDF_00001";
	/**
     * 获取form定义错误
     */
    public static final String COM_00001 = "COM_00001";
	
	/**
	 * TABLEID 对应的表在数据库中不存在
	 */
	public static final String INP_00001 = "INP_00001";
	/**
	 * TABLE 获取用户表权限出错
	 */
	public static final String INP_00002 = "INP_00002";
	
	/**
	 * @Fields INP_00003 : 加载表主键信息错误
	 */
	public static final String INP_00003 = "INP_00003";
	/**
     * @Fields INP_00004 : 加载表列信息错误
     */
    public static final String INP_00004 = "INP_00004";
    /**
     * @Fields INP_00004 : 加载表列限制错误
     */
    public static final String INP_00005 = "INP_00005";
    
	
	/**
     * 保存数据报错
     */
    public static final String INP_00101 = "INP_00101";
    /**
     * 修改数据报错
     */
    public static final String INP_00102 = "INP_00102";
    /**
     * 删除数据报错
     */
    public static final String INP_00103 = "INP_00103";
    /**
     * 备份表不存在
     */
    public static final String INP_00104 = "INP_00104";
    /**
     * 备份出错
     */
    public static final String INP_00105 = "INP_00105";
    /**
     * 公式刷新错误
     */
    public static final String INP_00106 = "INP_00106";
    /**
     * 物理主键缺失
     */
    public static final String INP_00107 = "INP_00107";
    
    

    /**
     * 数据审核错误
     */
    public static final String INP_00200 = "INP_00200";
	/**
	 * 录入表字段不能为空
	 */
	public static final String INP_00201 = "INP_00201";
	/**
	 * 录入表字段长度超长
	 */
	public static final String INP_00202 = "INP_00202";
	/**
	 * 录入表字段正则校验出错
	 */
	public static final String INP_00203 = "INP_00203";
	/**
	 * 录入表主键校验重复
	 */
	public static final String INP_00204 = "INP_00204";
	/**
	 * 录入表取数报错
	 */
	public static final String INP_00205 = "INP_00205";
	
	/**
	 * @Fields INP_00206 : 表没有设置主键信息 
	 */
	public static final String INP_00206 = "INP_00206"; 
	/**
     * @Fields INP_00207 : 没有加载到表列信息 
     */
    public static final String INP_00207 = "INP_00207"; 
    /**
     * @Fields INP_00208 : 引用列没有设置引用代码表
     */
    public static final String INP_00208 = "INP_00208"; 
    /**
     * @Fields INP_00209 : 引用列设置的代码表不存在
     */
    public static final String INP_00209 = "INP_00209"; 
    /**
     * @Fields INP_00210 : 加载引用代码表数据出错
     */
    public static final String INP_00210 = "INP_00210";
    /**
     * @Fields INP_00211 : 加载表默认值出错
     */
    public static final String INP_00211 = "INP_00211"; 
    /**
     * @Fields INP_00212 : 加载表超链接信息出错
     */
    public static final String INP_00212 = "INP_00212"; 
    /**
     * @Fields INP_00213 : 加载表公式信息出错
     */
    public static final String INP_00213 = "INP_00213";
    /**
     * @Fields INP_00214 : 加载表级联引用信息出错
     */
    public static final String INP_00214 = "INP_00214";
    /**
     * @Fields INP_00215 : 当前列没有级联关系定义
     */
    public static final String INP_00215 = "INP_00215";
    /**
     * @Fields INP_00216 : 没有找到当前列对应的级联关系定义
     */
    public static final String INP_00216 = "INP_00216";
    /**
     * @Fields INP_00217 : 公式计算错误
     */
    public static final String INP_00217 = "INP_00217";
    /**
     * @Fields INP_00218 : 单元格公式计算错误
     */
    public static final String INP_00218 = "INP_00218";
    /**
     * @Fields INP_00219 : 加载列绑定信息错误
     */
    public static final String INP_00219 = "INP_00219";
    /**
     * @Fields INP_00220 : 数据审核强制性信息
     */
    public static final String INP_00220 = "INP_00220";
    /**
     * @Fields INP_00221 : 数据审核提示性信息
     */
    public static final String INP_00221 = "INP_00221";
    /**
     * @Fields INP_00221 : 主子表中找不到定义的主表
     */
    public static final String INP_00222 = "INP_00222";
    /**
     * @Fields INP_00221 : 主外键关系列在主表没有值
     */
    public static final String INP_00223 = "INP_00223";

	/**
	 * 执行SQL报错
	 */
	public static final String INP_20000 = "INP_20000";
	/**
     * @Fields INP_20001 : 预算记账失败
     */
    public static final String INP_20001 = "INP_20001";
    
    /**
     * @Fields INP_20002 : 预算确认失败
     */
    public static final String INP_20002 = "INP_20002";
    
    /**
     * @Fields INP_20003 : 记账的数据失败
     */
    public static final String INP_20003 = "INP_20003";
    
    /**
     * @Fields INP_20004 : 记账规则定义不全
     */
    public static final String INP_20004 = "INP_20004";
	/**
	 * 获取数据报错
	 */
	public static final String INP_20100 = "INP_20100";
	/**
	 * 获取报表树的相关信息报错
	 */
	public static final String INP_21100 = "INP_21100";
	/**
	 * 获取填报页面任务树相关信息报错
	 */
	public static final String INP_22100 = "INP_22100";
	/**
	 * 获取采集范围信息报错
	 */
	public static final String INP_22000 = "INP_22000";
	/**
	 * 获取视角信息报错
	 */
	public static final String INP_23100 = "INP_23100";

	/**
	 * 获取视角的单位/地区代码表信息报错
	 */
	public static final String INP_23101 = "INP_23101";

	/**
	 * 预算表数据保存报错
	 */
	public static final String INP_24100 = "INP_24100";
	/**
	 * 预算表数据查询报错
	 */
	public static final String INP_24101 = "INP_24101";
	/**
	 * 预算表修改数据报错
	 */
	public static final String INP_24102 = "INP_24102";
	/**
	 * 预算表数据删除报错
	 */
	public static final String INP_24103 = "INP_24103";
	/** 
	* 基本支出录入表 该专项下没有经济科目
     */
    public static final String INP_25201 = "INP_25201";
    /**
     * 项目支出明细表中没有列对应到资金来源
     */
    public static final String INP_26001 = "INP_26001";

    /**
     * backup备份出错
     */
    public static final String INP_2B000 = "INP_2B000";
	/**
	 * backup获取备份信息出错
	 */
	public static final String INP_2B100 = "INP_2B100";
	
	/**
	 * @Fields INP_2C201 : 获取页面自定义信息出错，如：隐藏列，自定义条件等
	 */
	public static final String INP_2C201 ="INP_2C201";
	/**
	 * @Fields INP_2C101 : 设置/保存/删除自定义信息出错
	 */
	public static final String INP_2C101 ="INP_2C101";
	
	/**
     * dataaudit包下获取对象报错
     */
    public static final String SET_00200 = "SET_00200";
    /**
     * dataaudit包下保存新增对象报错
     */
    public static final String SET_00100 = "SET_00100";
    /**
     * dataaudit包下修改数据报错
     */
    public static final String SET_00101 = "SET_00101";
    /**
     *dataaudit包下 删除数据报错
     */
    public static final String SET_00102 = "SET_00102";
    
    /**
     * exception包下获取对象报错
     */
    public static final String SET_01200 = "SET_01200";
    /**
     * exception包下保存新增对象报错
     */
    public static final String SET_01100 = "SET_01100";
    /**
     * exception包下修改数据报错
     */
    public static final String SET_01101 = "SET_01101";
    /**
     *exception包下 删除数据报错
     */
    public static final String SET_01102 = "SET_01102";
    /**
     * input包下主子表相关的根据条件查询
     */
    public static final String SET_02200 = "SET_02200";
    /**
    * input包下主子表取树
    */
    public static final String SET_02100 = "SET_02100";
    /**
     * input包下主子表左侧树的新增、删除
     */
    public static final String SET_02101 = "SET_02101";
    /**
     * input包下右侧获取数据
     */
    public static final String SET_02102 = "SET_02102";
    /**
     * input包下主子表右侧的新增、删除
     */
    public static final String SET_02103 = "SET_02103";
    /**
     * input包下主子表详细设置页面查询
     */
    public static final String SET_02104 = "SET_02104";
    /**
     * input包下主子表详细设置页面新增 删除 修改
     */
    public static final String SET_02105 = "SET_02105";
    /**
     * dict包获取某个级别下的全部套表；（普通结构）出现异常
     */
    public static final String DCT_01100 = "DCT_01100";

    
    /**
     * basicpay 取数据报错
     */
     public static final String SET_20100 = "SET_20100";
     /**
      * basicpay 新增数据报错
      */
     public static final String  SET_20101 = "SET_20101";
    /**
     * basicpay 修改数据报错
     */
    public static final String  SET_20102 = "SET_20102";
   /**
    * basicpay 删除数据报错
    */
   public static final String  SET_20103 = "SET_20103";
   /**
    * 封装自定义表头
    */
   public static final String  SET_21104 = "SET_21104";
   /**
    * 获取该专项类型下的专项资金项目列表报错
    */
   public static final String  SET_21105 = "SET_21105";
   /**
    * 获取专项类型树报错
    */
   public static final String  SET_21106 = "SET_21106";
   /**
    * 保存经济科目和功能科目分组信息
    */
   public static final String  SET_21107 = "SET_21107";
   /**
    * 导出数据报错
    */
   public static final String  SET_21108 = "SET_21108";
   
	public static final String AUD_00001 = "";
	
	/**#########*******数据审核/综合审核 执行***START**###########/
    /**
     * 数据审核  调用存储过程，执行审核规则 报错
     */
    public static final String AUD_20001 = "AUD_20001";
    /**
     *数据审核  解析返回的审核结果(json) 错误   
     */
    public static final String AUD_20002 = "AUD_20002";
    /**
     * 数据审核 查询所有的物理表数据最大dbversion 失败   
     */
    public static final String AUD_20003 = "AUD_20003";
    /**
     *数据审核  对象转json失败
     */
    public static final String AUD_20004 = "AUD_20004";
    /**
     * 数据审核    审核对象的单位的deid未查到
     */
    public static final String AUD_20201 = "AUD_20201";
    /**
     * 审核对象是视图，且没有设置物理表 而且 本身也没有dbversion字段  添加dbversion字段 或在视图与物理表登记页面进行登记
     */
    public static final String AUD_20202 = "AUD_20202";
    /**
     * 审核对象是业务对象，但是其引用了非物理表 ， 而且 本身也没有dbversion字段  添加dbversion字段 或在视图与物理表登记页面进行登记
     */
    public static final String AUD_20203 = "AUD_20203";
    /**
     * 在录入对象和审核对象关系表中，查询审核对象失败
     */
    public static final String AUD_20101 = "AUD_20101";
    /**
     * 在model表中 查询审核对象失败
     */
    public static final String AUD_20102 = "AUD_20102";
    
    /**
     * 在视图和审核对象关系表查找物理表  失败
     */
    public static final String AUD_20103 = "AUD_20103";
    /**
     * 根据审核对象查找物理表失败
     */
    public static final String AUD_20104 = "AUD_20104";
    /**
     * 查询 单位级次错误
     */
    public static final String AUD_20105 = "AUD_20105";
    /**
     * 查询业务审核规则失败
     */
    public static final String AUD_20106 = "AUD_20106";
    /**
     * 执行审核报错
     */
    public static final String AUD_20107 = "AUD_20107";
    /**
     * 数据审核oa流程handler 有审核错误 
     */
    public static final String AUD_30101 = "AUD_30101";
    /**#########*******数据审核/综合审核 执行***END**###########/
    
    /**#########*******基本支出录入表***START**###########/
    /**
     * 基本支出录入表  刷新公式错误
     */
    public static final String AUD_23101 = "AUD_23101";
    
    /**#########*******基本支出录入表***END**###########/
    
    
    /**#########*******数据审核公式定义***START**###########/
     */
    /**
     * 数据审核公式定义 模块默认错误
     */
    public static final String AUD_24200 = "AUD_24200";
    /**
     * 数据审核公式定义 无法删除规则，原因所选规则有业务模块引用无法删除
     */
    public static final String AUD_24201 = "AUD_24201";
    /**
     * 数据审核公式定义   无法删除审核分类  原因 数据审核规则分类被引用,无法删除
     */
    public static final String AUD_24202 = "AUD_24202";
    /**
     * 数据审核公式定义   审核审核分类序号重复
     */
    public static final String AUD_24203 = "AUD_24203";
    /**
     * 数据审核公式定义 该分类（数据审核分类）已使用,不允许添加子分类
     */
    public static final String AUD_24204 = "AUD_24204";
    /**
     * 数据审核公式定义 在解析过程中  表不存在
     */
    public static final String AUD_24205 = "AUD_24205";
    /**
     * 数据审核公式定义   引用表没有数据
     */
    public static final String AUD_24206 = "AUD_24206";
    /**
     * 数据审核公式定义   数据审核规则SQL验证失败
     */
    public static final String AUD_24208 = "AUD_24208";
    /**
     * 数据审核公式定义   解析表达式引用代码表 出错 代码表不存在
     */
    public static final String AUD_24209 = "AUD_24209";
    /**
     * 数据审核公式定义   解析表达式列信息 出错 列在表中不存在
     */
    public static final String AUD_24210 = "AUD_24210";
    /**
     * 数据审核公式定义  验证表达式、分组、where条件 出错 存在语法错误
     */
    public static final String AUD_24211 = "AUD_24211";
    /**
     * 数据审核公式定义  审核分类不存在
     */
    public static final String AUD_24212 = "AUD_24212";
    /**
     * 数据审核公式定义  上级审核分类下级不能导入、编辑等
     */
    public static final String AUD_24213 = "AUD_24213";
    
    
    /**#########*******数据审核公式定义****END *###########*/
    
    /**#########*******定额公式设置***START**###########/
    /**
     * 定额公式设置  无效数字，只有数值类型的列才能进行计算
     */
    public static final String FRU_20201 = "FRU_20201";
    /**
     * 定额公式设置  公式名称重复
     */
    public static final String FRU_20202 = "FRU_20202";
    /**
     * 定额公式设置  公式中标准无法解析，请检查 
     */
    public static final String FRU_20203 = "FRU_20203";
    /**
     * 定额公式设置    表 无法从数据库中解析
     */
    public static final String FRU_20204 = "FRU_20204";
    /**
     * 定额公式设置   列名 错误，无法从数据库中解析！
     */
    public static final String FRU_20205 = "FRU_20205";
    /**
     * 定额公式设置   公式内容无法解析，请检查！
     */
    public static final String FRU_20206 = "FRU_20206";
    /**
     * 定额公式设置   数据类型校验失败
     */
    public static final String FRU_20207 = "FRU_20207";
    /**
     * 定额公式设置   刷新触发器 失败
     */
    public static final String FRU_20101 = "FRU_20101";
    /**#########*******定额公式设置***END**###########/
     * 
     */
    /**
     * 基本支出数据确认失败
     */
    public static final String AUD_23102 = "AUD_23102";
    
    /**
     * 刷新标记 错误
     */
    public static final String AUD_23103 = "AUD_23103";

    /**
     * 公式定义中校验有误
     */
    public static final String FRU_00001 = "FRU_00001";
    /**
     * 公式刷触发器报错
     */
    public static final String FRU_00002 = "FRU_00002";
    /**
     * 公式表达式计算结果不是数字
     */
    public static final String FRU_00201 = "FRU_00201";
	/**
	 * 录入页面刷新公式报错
	 */
	public static final String FRU_00101 = "FRU_00101";
	/**
	 * 执行公式报错
	 */
	public static final String FUR_20000 = "FUR_20000";
	/**
	 * 获取数据错误
	 */
	public static final String SET_07200 = "SET_07200";
	/**
	 * 浮动表 固定行列表设置 保存 异常
	 */
	public static final String SET_07201 = "SET_07201";
	/**
	 * 获取单个MODEL报错
	 */
	public static final String DTM_07200 = "DTM_07200";
	/**
	 * 获取任务相关信息报错
	 */
	public static final String TSK_07100 = "TSK_07100";
	/**
     * 获取任务对应表出现异常
    */
    public static final String TSK_07101 = "TSK_07101";
	/**
	 * 获取数据权限有关内容报错
	 */
	public static final String SEC_00100 = "SEC_00100";

	// 项目删除
	/**
	 * 处理类型对应表或视图不存在
	 */
	public static final String ERR_1X201 = "ERR_1X201";
	/**
	 * 表定义封装时报错
	 */
	public static final String ERR_1X202 = "ERR_1X202";
	/**
	 * 获取列表数据时发生异常
	 */
	public static final String ERR_1X203 = "ERR_1X203";
	/**
	 * 删除数据发生错误
	 */
	public static final String ERR_1X204 = "ERR_1X204";

	// 项目库设置
	/**
	 * 保存数据发生错误
	 */
	public static final String ERR_1H201 = "ERR_1H201";
	/**
	 * 列表数据封装发生异常
	 */
	public static final String ERR_1H202 = "ERR_1H202";
	/**
	 * 修改数据发生异常
	 */
	public static final String ERR_1H203 = "ERR_1H203";
	/**
	 * 批量复制数据发生异常
	 */
	public static final String ERR_1H204 = "ERR_1H204";

	// 项目库权限设置
	/**
	 * 引用代码表不存在
	 */
	public static final String ERR_1I201 = "ERR_1I201";
	/**
	 * 获取平台角色接口发生异常
	 */
	public static final String ERR_1I202 = "ERR_1I202";

	/**
	 * 专项发布异常(LK)
	 */
	// BEGIN
	public static final String ERR_1P201 = "ERR_1P201";// 获取当前地区发生异常
	public static final String ERR_1P202 = "ERR_1P202";// 获取上级地区发生异常
	public static final String ERR_1P203 = "ERR_1P203";// 获取左侧树发生异常
	public static final String ERR_1P204 = "ERR_1P204";// 删除原来的发布指南发生异常
	public static final String ERR_1P205 = "ERR_1P205";// 插入新的发布指南记录发生异常
	public static final String ERR_1P206 = "ERR_1P206";// 修改发布指南记录发生异常
	public static final String ERR_1P207 = "ERR_1P207";// 更新发布状态发生异常
	public static final String ERR_1P208 = "ERR_1P208";// 发布完成同步BAK表发生异常
	public static final String ERR_1P209 = "ERR_1P209";// 获取该专项的发布指南发生异常
	public static final String ERR_1P20A = "ERR_1P20A";// 取消发布,将该专项发布状态掷为1时发生异常
	public static final String ERR_1P20B = "ERR_1P20B";// 取消发布发布指南,将该专项发布指南状态掷为0发生异常
	public static final String ERR_1P20C = "ERR_1P20C";// 取消发布完成同步BAK表发生异常
	// END

	/**
	 * 项目倒挂异常(LK)
	 */
	// BEGIN
	public static final String ERR_1W201 = "ERR_1W201";// 获取当前地区发生异常
	public static final String ERR_1W202 = "ERR_1W202";// 获取上级地区发生异常
	public static final String ERR_1W203 = "ERR_1W203";// 获取左侧树发生异常
	public static final String ERR_1W204 = "ERR_1W204";// 过滤含有倒挂项目ID的联合申报文的公文ID发生异常
	public static final String ERR_1W205 = "ERR_1W205";// 删除TASKID为倒挂项目并且为联合申报文的中间表相关记录发生异常
	public static final String ERR_1W206 = "ERR_1W206";// 向OA中间表中重新插入含所选公文和所选项目的记录发生异常
	public static final String ERR_1W207 = "ERR_1W207";// 修改倒挂操作后的项目所属SPFID和PROJTYPEID发生异常
	public static final String ERR_1W208 = "ERR_1W208";// 同步BAK表时发生异常
	public static final String ERR_1W209 = "ERR_1W209";// 方法弃用
	public static final String ERR_1W20A = "ERR_1W20A";// 获取该一级项目对应的公文个数出现异常
	public static final String ERR_1W20B = "ERR_1W20B";// 从DICT_T_PUBLIC表中获取倒挂所需的联合申报文业务类型的32位码出现异常
	public static final String ERR_1W20C = "ERR_1W20C";// 获取公文表数据出现异常
	public static final String ERR_1W20D = "ERR_1W20D";// 获取设置表数据异常
	// END
	/**
	 * 专项资金类别异常(LK)
	 */
	// BEGIN
	public static final String ERR_1I211 = "ERR_1I211";// 初始化专项类别树出错
	public static final String ERR_1I212 = "ERR_1I212";// 获取ORDERID出错
	public static final String ERR_1I213 = "ERR_1I213";// 获取区划出错
	public static final String ERR_1I214 = "ERR_1I214";// 获取新增数据父级编码出错
	public static final String ERR_1I215 = "ERR_1I215";// 获取新增数据的编码出错
	public static final String ERR_1I216 = "ERR_1I216";// 修改父级节点的ISLEAF字段出错
	public static final String ERR_1I217 = "ERR_1I217";// 通过删除节点的DATAKEY获取其SUPERID出错
	public static final String ERR_1I218 = "ERR_1I218";// 判断删除完成后该节点的父节点下是否还有子节点出错
	public static final String ERR_1I219 = "ERR_1I219";// 删除后无子节点,修改其父节点的ISLEAF字段出错
	public static final String ERR_1I21A = "ERR_1I21A";// 获取当前地区节点总数出错
	public static final String ERR_1I21B = "ERR_1I21B";// 查询模板数据出错
	public static final String ERR_1I21C = "ERR_1I21C";// 插入模板根节点出错

	// END
	/**
	 * 专项资金类别异常(LK)
	 */
	// BEGIN
	public static final String ERR_1H211 = "ERR_1H211";// 获取财政用户树出错
	public static final String ERR_1H212 = "ERR_1H212";// 该表设置列属性时报错
	public static final String ERR_1H213 = "ERR_1H213";// 更新用户对项目类别表出错
	public static final String ERR_1H214 = "ERR_1H214";// 查询用户对项目类别表出错
	public static final String ERR_1H215 = "ERR_1H215";// 新增用户对项目类别时出错
	public static final String ERR_1H216 = "ERR_1H216";// 获取部门用户树出错
	public static final String ERR_1H217 = "ERR_1H217";// 删除用户对项目类别表权限记录出错
	public static final String ERR_1H218 = "ERR_1H218";// 获取用户对项目类别权限列表出错
	public static final String ERR_1H219 = "ERR_1H219";// 获取当前地区出错
	public static final String ERR_1H21A = "ERR_1H21A";// 获取当前处室或部门其他用户树出错
	public static final String ERR_1H21B = "ERR_1H21B";// 保存批量复制操作出错
	public static final String ERR_1H21C = "ERR_1H21C";// 获取项目类别表信息异常
	public static final String ERR_1H21D = "ERR_1H21D";// 获取设置表数据出现异常
	// END
	/**
	 * 查询用户单位的相关信息时发生异常
	 */
	public static final String ERR_1O201 = "ERR_1O201";
	/**
	 * 查询表对象发生异常
	 */
	public static final String ERR_1O202 = "ERR_1O202";
	/**
	 * 查询是否存在专项时出现异常
	 */
	public static final String ERR_1O203 = "ERR_1O203";
	/**
	 * 专项记账
	 */
	public static final String ERR_1O004 = "ERR_1O004";

	/**
	 * 专项确认
	 */
	public static final String ERR_1O005 = "ERR_1O005";

	/**
	 * 项目库预算确认时记账
	 */
	public static final String ERR_1O006 = "ERR_1O006";

	/**
	 * 专项，一级项目调整
	 */
	public static final String ERR_1L100 = "ERR_1L100";// 专项资金调整时原业务表覆盖_bak表时异常
	public static final String ERR_1L101 = "ERR_1L101";// 专项资金调整列表获取业务数据异常
	public static final String ERR_1L102 = "ERR_1L102";// 专项资金调整时送审，取消送审异常

	/**
	 * 专项，一级项目备份
	 */
	public static final String ERR_1N100 = "ERR_1N100";//专项资金备份列表获取业务数据异常
    public static final String ERR_1N101 = "ERR_1N101";//专项资金备份列表定义异常


	/**
	 * 专项项目，二级项目调整
	 */
	public static final String ERR_1R100 = "ERR_1R100";// 项目调整时送审，取消送审异常
	public static final String ERR_1R101 = "ERR_1R101";// 项目调整时原业务表覆盖_bak表时异常

	/**
	 * 专项项目，二级项目备份
	 */
	public static final String ERR_1T100 = "ERR_1T100";//

	// DCM
	/**
	 * 专项记账
	 */
	public static final String ERR_1O204 = "ERR_1O204";

	/**
	 * 专项确认
	 */
	public static final String ERR_1O205 = "ERR_1O205";

	/**
	 * 项目库预算确认时记账
	 */
	public static final String ERR_1O206 = "ERR_1O206";

	/**
	 * 查询专项基本信息数据报错
	 */
	public static final String ERR_1O207 = "ERR_1O207";
	/**
	 * 查询专项是否存在时候报错
	 */
	public static final String ERR_1O208 = "ERR_1O208";

	/**
	 * 查询左侧树时候报错
	 */
	public static final String Err_1o209 = "Err_1o209";
	
	
	/**
	 * 记账规则没定义完整
	 */
	public static final String ERR_1A001 = "ERR_1A001"; 
	
	/**
	 * 记账规则定义超过1个
	 */
	public static final String ERR_1A002 = "ERR_1A002";
	
	 /**
     * 记账的数据失败
     */
    public static final String ERR_1A003 = "ERR_1A003";
    
    /**
     * 记账规则定义不全
     */
    public static final String ERR_1A004 = "ERR_1A004";
	
	
	
	/**
	 * 项目管理-纳入预算  
	 * 代码标识：ERR_1U
	 */
	
	/**
	 * 系统默认错误
	 */
	public static final String ERR_1U000 = "ERR_1U000";
	/**
	 * 查询返回 错误
	 */
	public static final String ERR_1U001 = "ERR_1U001";
	/**
	 * insert 错误
	 */
	public static final String ERR_1U002 = "ERR_1U002";
	/**
	 * update 错误
	 */
	public static final String ERR_1U003 = "ERR_1U003";
	/**
	 * delete 错误
	 */
	public static final String ERR_1U004 = "ERR_1U004";
	/**
	 * 调用存储过程 错误
	 */
	public static final String ERR_1U005 = "ERR_1U005";	
	
	
	/**
	 * 调用外部服务错误
	 */
	public static final String ERR_1U101 = "ERR_1U101";	
	
	/**
	 * 一般性提示错误
	 */
	public static final String ERR_1U200 = "ERR_1U200";
	/**
	 * 数据校验错误
	 */
	public static final String ERR_1U201 = "ERR_1U201";
	
	/**
	 * 单据-类型设置错误         SET_51000
	 * 单据-主子表设置错误    SET_52000
	 * 单据-编码设置错误         SET_53000
	 * 单据-录入错误                  INP_5I000
	 * 单据-审核错误                 AUD_5A000
	 */

	
    /**
     * 获取单据类型左侧树异常
     */
    public static final String SET_51001 = "SET_51001"; 
    /**
     * 获取单据类型数据异常
     */
    public static final String SET_51002 = "SET_51002"; 
    /**
     * 删除单据类型设置信息异常
     */
    public static final String SET_51003 = "SET_51003"; 
    /**
     * 单据类型设置错误
     */
    public static final String SET_51201 = "SET_51201"; 
    /**
     * 批量保存审核规则失败
     */
    public static final String SET_51202 = "SET_51202"; 
    /**
     * 调用平台菜单接口异常
     */
    public static final String SET_51203 = "SET_51203"; 
    /**
     * 获取审核角色数据异常
     */
    public static final String SET_51204 = "SET_51204"; 
    
    //-----------单据录入异常--------------
	/**
	 * 单据主子表设置初始化OA业务区视图 返回异常
	 */
	public static final String SET_52001 = "SET_52001";
    /**
     * 未设置主子表关系异常
     */
    public static final String INP_5I201 = "INP_5I201"; 
    /**
     * 未设置单据编码规则
     */
    public static final String INP_5I202 = "INP_5I202"; 
    /**
     * 查询数据错误
     */
    public static final String INP_5I203 = "INP_5I203"; 
    /**
     * 获取单据编码错误
     */
    public static final String INP_5I204 = "INP_5I204"; 
    /**
     * 保存审核结果错误
     */
    public static final String AUD_5A001 = "AUD_5A001"; 
    /**
     * 业务表未设置单据唯一标识符数据源
     */
    public static final String AUD_5A002 = "AUD_5A002"; 
    /**
     * 单据强制性审核错误
     */
    public static final String AUD_5A003 = "AUD_5A003"; 
    
    
    
    /**
	 * 绩效评价共性指标库  yll
	 * 代码标识：SET_43
	 */
	/**
	 * 保存绩效评价指标数据返回错误
	 */
	public static final String SET_43001 = "SET_43001";
	/**
	 * 获取是否代码表数据返回错误  与zzk同用
	 */
	public static final String SET_40002 = "SET_40002";
	/**
	 * 获取口径设置信息数据返回错误
	 */
	public static final String SET_43003 = "SET_43003";
	/**
	 * 获取获取口径对象树数据返回错误
	 */
	public static final String SET_43009 = "SET_43009";
	/**
	 * 上级叶子节点标志返回错误
	 */
	public static final String SET_43010 = "SET_43010";
	/**
	 * 保存绩效指标,口径对应关系返回错误
	 */
	public static final String SET_43011 = "SET_43011";
	
	/**
	 *项目 绩效评价共性指标库列表返回错误
	 */
	public static final String SET_43004 = "SET_43004";//项目
	/**
	 * 专项绩效评价共性指标库列表返回异常
	 */
	public static final String SET_43005 = "SET_43005";//专项
	/**
	 * 部门绩效评价共性指标库列表返回异常
	 */
	public static final String SET_43006 = "SET_43006";//部门
	/**
	 * 财政绩效评价共性指标库列表返回异常
	 */
	public static final String SET_43007 = "SET_43007";//财政
	
	/**
	 * 获取项目绩效指标树列表返回错误
	 */
	public static final String SET_43080 = "SET_43080";
	/**
	 * 获取专项绩效指标树列表返回错误
	 */
	public static final String SET_43081 = "SET_43081";
	/**
	 * 获取部门绩效指标树列表返回错误
	 */
	public static final String SET_43082 = "SET_43082";
	/**
	 * 获取财政绩效指标树列表返回错误
	 */
	public static final String SET_43083 = "SET_43083";
	
	
	
	
	/**
	 * 绩效口径管理  yll
	 * 代码标识：SET_41
	 */
	/**
	 * 保存绩效评价口径设置返回错误
	 */
	public static final String SET_41010 = "SET_41010";
	/**
	 * 绩效评价口径设置列表返回异常
	 */
	public static final String SET_41011 = "SET_41011";
	/**
	 * 绩效评价口径设置代码表列表返回异常
	 */
	public static final String SET_41012 = "SET_41012";
	/**
	 * 绩效评价口径设置口径列列表返回异常
	 */
	public static final String SET_41013 = "SET_41013";
	
	/**
	 * 保存绩效指标口径设置返回错误
	 */
	public static final String SET_41020 = "SET_41020";
	/**
	 * 绩效指标口径设置列表返回返回异常
	 */
	public static final String SET_41021 = "SET_41021";
	/**
	 * 绩效指标口径设置代码表列表返回返回异常
	 */
	public static final String SET_41022 = "SET_41022";
	
	/**
	 * 保存绩效录入表口径设置返回错误
	 */
	public static final String SET_41030 = "SET_41030";
	/**
	 * 绩效录入表口径设置列表返回异常
	 */
	public static final String SET_41031 = "SET_41031";
	/**
	 * 绩效录入表口径设置代码表列表返回异常
	 */
	public static final String SET_41032 = "SET_41032";


	/**
	 * 保存绩效指标数据出错
	 */
	public static final String SET_42001 = "SET_42001";
	/**
	 * 绩效指标库列表返回错误
	 */
	public static final String SET_42002 = "SET_42002";
	/**
	 * 获取绩效指标库口径设置信息数据出错
	 */
	public static final String SET_42010 = "SET_42010";
	/**
	 * 获取绩效指标库口径对象树数据出错
	 */
	public static final String SET_42011 = "SET_42011";
	/**
	 * 保存绩效指标口径对应关系出错
	 */
	public static final String SET_43012 = "SET_43012";
	/**
	 * 上级叶子节点标志出错
	 */
	public static final String SET_42020 = "SET_42020";
	
	
	/**
	 * 单据-单据编码设置错误管理 yll
	 *  代码标识： SET_53000       
	 */
	/**
	 * 单据编码取得初始编码属性返回异常
	 */
	public static final String SET_53001 = "SET_53001";
	/**
	 * 单据编码取得设置编码属性返回异常
	 */
	public static final String SET_53002 = "SET_53002";
	/**
	 * 单据编码保存设置编码属性返回异常
	 */
	public static final String SET_53003 = "SET_53003";
	/**
	 * 单据编码批量复制 设置规则返回异常
	 */
	public static final String SET_53004 = "SET_53004";
	/**
	 * 单据编码保存编码设置 返回异常
	 */
	public static final String SET_53005 = "SET_53005";
	

	/**
	 * 绩效评价录入表维护--管理 wtf
	 *  代码标识： SET_44000       
	 */
	/**
	 * 保存录入列表数据异常
	 */
	public static final String SET_44000 = "SET_44000";
	/**
	 * 获取是否代码表数据出错
	 */ 
	public static final String SET_44002 = "SET_44002";
	/**
	 * 获取口径对象树数据出错
	 */ 
	public static final String SET_44003 = "SET_44003";
	
	/**
	 * 获取口径对象树数据出错
	 */ 
	public static final String SET_44004 = "SET_44004";
	/**
	 * 保存主从关系数据出错
	 */ 
	public static final String SET_44005 = "SET_44005";
	/**
	 * 绩效表单列设置出错
	 */ 
	public static final String SET_44006 = "SET_44006";
	/**
	 * 保存表单列属性出错出错
	 */ 
	public static final String SET_44007 = "SET_44007";
	/**
	 * 表单列属性列表数据出错
	 */ 
	public static final String SET_44008 = "SET_44008";
	
	
	
	/**
	 * 按口径批量复制录入模板异常
	 */ 
	public static final String SET_44010 = "SET_44010";
	
	/**
	 * 按环节批量复制录入模板异常
	 */ 
	public static final String SET_44011 = "SET_44011";
	
	/**
	 * 控制列表定义异常	 */ 
	public static final String SET_44012 = "SET_44012";
	
	/**
	 * 主附设置列表定义异常	 */ 
	public static final String SET_44022 = "SET_44022";

	/**
	 * 获取控制列列表数据异常
	 */ 
	public static final String SET_44013 = "SET_44013";
	

	/**
	 * 获取主附设置数据异常
	 */ 
	public static final String SET_44023 = "SET_44013";
	

	/**
	 * 保存控制列数据出错
	 */ 
	public static final String SET_44014 = "SET_44014";
	

	/**
	 * 保存主附设置数据出错
	 */ 
	public static final String SET_44024 = "SET_44014";
	
	//---------绩效业务流程中出现的异常信息---------
	/**
     * 绩效填报异常  wangjianping
     * 代码标识：INP_45***
     */
	//-----------------------------------
	/**
     * 错误的绩效处理类型
     */
    public static final String INP_45000 = "INP_45000";
	/**
	 * 绩效所处阶段未设置主子表！
	 */
	public static final String INP_45001 = "INP_45001";
	/**
     * 绩效所处阶段的表未设置主从表关系！
     */
    public static final String INP_45002 = "INP_45002";
	
	/**
     * 当前取消的绩效已经在当前阶段确认审核，无法取消！
     */
    public static final String INP_45003 = "INP_45003";
    /**
     * 获取绩效（评价）指标口径失败异常！
     */
    public static final String INP_45004 = "INP_45004";
    /**
     * 错误的绩效环节！
     */
    public static final String INP_45005 = "INP_45005";
    /**
     * 绩效执行SQL报错
     */
    public static final String INP_45006 = "INP_45006";
    /**
     * 获取绩效类型出错
     */
    public static final String INP_45007 = "INP_45007";
    /**
     * 绩效所处阶段未设置主表未FORM样式！
     */
    public static final String INP_45008 = "INP_45008";
    /**
     * 评价表数据迁移异常！
     */
    public static final String INP_45009 = "INP_45009";
    /**
     * 查询评价表数据异常！
     */
    public static final String INP_45010 = "INP_45010";
    
    
    /**
     * @Fields EXT_20100 : 预算3.0 oa接口 查询数据异常
     */
    public static final String EXT_20100 = "EXT_20100";
    /**
     * @Fields EXT_20100 : 预算3.0 oa接口 写入数据异常
     */
    public static final String EXT_21100 = "EXT_21100";
    /**
     * @Fields EXT_20100 : 预算3.0 oa接口 删除数据异常
     */
    public static final String EXT_21101 = "EXT_21101";
    /**
     * @Fields EXT_20100 : 预算3.0 oa接口 修改数据异常
     */
    public static final String EXT_22100 = "EXT_22100";
    /**
     * @Fields EXT_23100 :  预算3.0 oa接口 调用公文接口
     */
    public static final String EXT_23100 = "EXT_23100";
    
}
