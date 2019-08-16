package com.lbi.tile.model;

import lombok.Data;


@Data
public class TileSetDO {
    /**
     * 主键
     */
    long id;
    /**
     * 地图ID
     */
    long mapId;

    String href;
    /**
     * 地面分辨率。像素代表地面的距离（米），单位为像素/米
     */
    String unitsPerPixel;
    /**
     * 排列顺序
     */
    int sortOrder;
}
