
package com.lbi.tile.dao;

import com.lbi.tile.model.TileMapVO;
import com.lbi.tile.model.TileSetDO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

/*************************************
 * Class Name: TileMapDao
 * Description:〈瓦片地图Dao〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Repository
@Slf4j
public class TileMapDao extends CommonDao{
    @Value("${spring.table.t_tilemap}")
    String t_tilemap;
    @Value("${spring.table.t_tileset}")
    String t_tileset;

    public List<TileMapVO> listTileMap(){
        StringBuilder sb=new StringBuilder();
        sb.append("select t1.*,t2.min_zoom,t2.max_zoom from "+t_tilemap+" t1 left join");
        sb.append(" (select map_id,min(sort_order) as min_zoom,max(sort_order) as max_zoom from "+t_tileset+" group by map_id) t2");
        sb.append(" on t1.id=t2.map_id");
        //String sql=String.format("select * from %s order by id",t_tilemap);
        return jdbcTemplate.query(sb.toString(), (rs,rowNum)->toTileMapVO(rs));
    }

    public TileMapVO getTileMap(long id){
        String sql=String.format("select * from %s where id=?",t_tilemap);
        List<TileMapVO> list=jdbcTemplate.query(
                sql,
                new Object[]{id},
                new int[]{Types.BIGINT},
                (rs,rowNum)->toTileMapVO(rs));

        if(list.isEmpty()){
            return null;
        }else {
            return list.get(0);
        }
    }

    public void addTileMap(TileMapVO tileMap){
        String sql=String.format("insert into %s(name,memo,service_id,kind,layer_group,epsg,minx,miny,maxx,maxy,origin_x,origin_y,tile_type,suffix,record_date,prop,width,height) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,256,256)",t_tilemap);
        jdbcTemplate.update(sql,
                new Object[]{
                        tileMap.getName(),
                        tileMap.getMemo(),
                        tileMap.getServiceId(),
                        tileMap.getKind(),
                        tileMap.getGroup(),
                        tileMap.getEpsg(),
                        tileMap.getMinX(),
                        tileMap.getMinY(),
                        tileMap.getMaxX(),
                        tileMap.getMaxY(),
                        tileMap.getOriginX(),
                        tileMap.getOriginY(),
                        tileMap.getTileType(),
                        tileMap.getSuffix(),
                        tileMap.getRecordDate(),
                        tileMap.getProp()
                },
                new int[]{
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.INTEGER,
                        Types.INTEGER,
                        Types.VARCHAR,
                        Types.BIGINT,
                        Types.DOUBLE,
                        Types.DOUBLE,
                        Types.DOUBLE,
                        Types.DOUBLE,
                        Types.DOUBLE,
                        Types.DOUBLE,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR
                });
    }

    public void updateTileMap(TileMapVO tileMap){
        String sql=String.format("update %s set name=?,memo=?,service_id=?,kind=?,layer_group=?,epsg=?,minx=?,miny=?,maxx=?,maxy=?,origin_x=?,origin_y=?,tile_type=?,suffix=?,record_date=?,prop=? where id=?",t_tilemap);
        jdbcTemplate.update(sql,
                new Object[]{
                        tileMap.getName(),
                        tileMap.getMemo(),
                        tileMap.getServiceId(),
                        tileMap.getKind(),
                        tileMap.getGroup(),
                        tileMap.getEpsg(),
                        tileMap.getMinX(),
                        tileMap.getMinY(),
                        tileMap.getMaxX(),
                        tileMap.getMaxY(),
                        tileMap.getOriginX(),
                        tileMap.getOriginY(),
                        tileMap.getTileType(),
                        tileMap.getSuffix(),
                        tileMap.getRecordDate(),
                        tileMap.getProp(),
                        tileMap.getId()
                },
                new int[]{
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.INTEGER,
                        Types.INTEGER,
                        Types.VARCHAR,
                        Types.BIGINT,
                        Types.DOUBLE,
                        Types.DOUBLE,
                        Types.DOUBLE,
                        Types.DOUBLE,
                        Types.DOUBLE,
                        Types.DOUBLE,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.BIGINT
                });
    }

    public void delTileMap(long id){
        String sql=String.format("delete from %s where id=?",t_tilemap);
        jdbcTemplate.update(sql,new Object[]{id},new int[]{Types.BIGINT});
    }

    public List<TileSetDO> listTileSet(long mapId){
        String sql=String.format("select * from %s where map_id=? order by sort_order",t_tileset);
        return jdbcTemplate.query(
                sql,
                new Object[]{mapId},
                new int[]{Types.INTEGER},
                (rs,rowNum)->toTileSetDO(rs));
    }

    public void addTileSet(TileSetDO tileSetDO){
        String sql=String.format("insert into %s(map_id,href,units_per_pixel,sort_order) values(?,?,?,?)",t_tileset);
        jdbcTemplate.update(sql,
                new Object[]{
                        tileSetDO.getMapId(),
                        tileSetDO.getHref(),
                        tileSetDO.getUnitsPerPixel(),
                        tileSetDO.getSortOrder()
                },
                new int[]{
                        Types.BIGINT,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.INTEGER
                });
    }

    public void delTileSet(long id){
        String sql=String.format("delete from %s where id=?",t_tileset);
        jdbcTemplate.update(sql,new Object[]{id},new int[]{Types.BIGINT});
    }

    private TileMapVO toTileMapVO(ResultSet rs)throws SQLException {
        TileMapVO u=new TileMapVO();
        u.setId(rs.getLong("id"));

        u.setName(rs.getString("name"));
        u.setMemo(rs.getString("memo"));

        u.setServiceId(rs.getLong("service_id"));
        u.setKind(rs.getInt("kind"));
        u.setGroup(rs.getString("layer_group"));
        u.setTileType(rs.getString("tile_type"));

        u.setEpsg(rs.getLong("epsg"));
        u.setMinX(rs.getDouble("minx"));
        u.setMinY(rs.getDouble("miny"));
        u.setMaxX(rs.getDouble("maxx"));
        u.setMaxY(rs.getDouble("maxy"));
        u.setOriginX(rs.getDouble("origin_x"));
        u.setOriginY(rs.getDouble("origin_y"));
        u.setSuffix(rs.getString("suffix"));
        u.setRecordDate(rs.getString("record_date"));
        u.setProp(rs.getString("prop"));

        if(isExistColumn(rs,"min_zoom")){
            u.setMinZoom(rs.getInt("min_zoom"));
        }
        if(isExistColumn(rs,"max_zoom")){
            u.setMaxZoom(rs.getInt("max_zoom"));
        }
        return u;
    }

    private TileSetDO toTileSetDO(ResultSet rs)throws SQLException{
        TileSetDO u=new TileSetDO();
        u.setId(rs.getLong("id"));
        u.setMapId(rs.getLong("map_id"));
        //String href=rs.getString("href");
        //href=href.replace("${mapserver}",mapserver);
        u.setHref(rs.getString("href"));
        u.setUnitsPerPixel(rs.getString("units_per_pixel"));
        u.setSortOrder(rs.getInt("sort_order"));
        return u;
    }
}
