package com.lbi.tile.dao;


import com.lbi.tile.model.CityDO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository(value="cityDao")
@Slf4j
public class CityDao extends CommonDao{
    @Value("${spring.table.china_city_polygon}")
    String china_city_polygon;

    public List<CityDO> getCityList(){
        String sql="select adcode,name,name_alias,x,y,minx,miny,maxx,maxy from "+china_city_polygon+" order by adcode";
        return jdbcTemplate.query(
                sql,
                (rs,rowNum)->toCityDO(rs));
    }

    private CityDO toCityDO(ResultSet rs)throws SQLException{
        CityDO u=new CityDO();
        u.setAdcode(rs.getString("adcode"));
        u.setName(rs.getString("name"));
        u.setX(rs.getDouble("x"));
        u.setY(rs.getDouble("y"));
        u.setMinX(rs.getDouble("minx"));
        u.setMinY(rs.getDouble("miny"));
        u.setMaxX(rs.getDouble("maxx"));
        u.setMaxY(rs.getDouble("maxy"));
        return u;
    }
}
