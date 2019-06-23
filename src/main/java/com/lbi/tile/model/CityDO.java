package com.lbi.tile.model;

import lombok.Getter;
import lombok.Setter;

/*************************************
 * Class Name: CityDO
 * Description:〈城市对象〉
 * @author deyi
 * @create 2019/6/11
 * @since 1.0.0
 ************************************/
@Getter
@Setter
public class CityDO {
    String adcode;
    String name;
    double x;
    double y;
    double minX;
    double minY;
    double maxX;
    double maxY;
}
