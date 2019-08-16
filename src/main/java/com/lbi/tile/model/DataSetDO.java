package com.lbi.tile.model;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/*************************************
 * Class Name: DataSetDO
 * Description:〈数据集〉
 * @since 1.0.0
 ************************************/
@Data
public class DataSetDO {
    /**
     * ID，主键
     */
    long id;
    /**
     * 地图ID
     */
    long mapId;
    /**
     * 名称
     */
    String name;
    /**
     * 备注
     */
    String memo;
    /**
     * 数据记录日期，用于影像时间序列
     */
    String recordDate;
    /**
     * 图层分组。L0-L4
     */
    String group;
    /**
     * 图层种类。1为普通图层，2为时序图层'
     */
    int kind;

    /**
     * 创建时间
     */
    @JSONField(format = "yyyy-MM-dd HH:mm:ss.SSS")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS", locale = "zh", timezone = "GMT+8")
    Date createTime;
    /**
     * 修改时间
     */
    @JSONField(format = "yyyy-MM-dd HH:mm:ss.SSS")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS", locale = "zh", timezone = "GMT+8")
    Date modifyTime;
}
