package com.lbi.tile.model;

import lombok.Data;

@Data
public class TileMapVO {
    long id;
    /**
     * 服务ID
     */
    long serviceId;
    /**
     * 标题
     */
    String name;
    /**
     * 图层类别
     */
    int kind;
    /**
     * 图层分组
     */
    String group;
    /**
     * 备注
     */
    String memo;
    /**
     * 瓦片类型
     */
    String tileType;
    /**
     * 瓦片文件后缀
     */
    String suffix;
    /**
     * 坐标投影系
     */
    Long epsg;
    /**
     * 最小经度
     */
    double minX;
    /**
     * 最小纬度
     */
    double minY;
    /**
     * 最大经度
     */
    double maxX;
    /**
     * 最大纬度
     */
    double maxY;
    /**
     * 原点经度
     */
    double originX;
    /**
     * 原点纬度
     */
    double originY;
    /**
     * 最小缩放级别
     */
    int minZoom;
    /**
     * 最大缩放级别
     */
    int maxZoom;

    /**
     * 数据记录日期，用于影像时间序列
     */
    String recordDate;
    /**
     * 配置
     */
    String prop;
}
