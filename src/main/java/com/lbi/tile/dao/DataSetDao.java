
package com.lbi.tile.dao;

import com.lbi.tile.model.DataSetDO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

/*************************************
 * Class Name: DataSetDao
 * Description:〈数据集Dao〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Repository
public class DataSetDao extends CommonDao{
    @Value("${spring.table.t_dataset}")
    String t_dataset;

    public List<DataSetDO> listDataSet(){
        String sql=String.format("select * from %s order by id",t_dataset);
        return jdbcTemplate.query(sql, (rs,rowNum)->toDataSetDO(rs));
    }

    public List<DataSetDO> listDataSet(String ids){
        String sql=String.format("select * from %s where id in (%s) order by id",t_dataset,ids);
        return jdbcTemplate.query(sql, (rs,rowNum)->toDataSetDO(rs));
    }

    public void addDataSet(DataSetDO dataSetDO){
        String sql=String.format("insert into %s(name,memo,record_date,layer_group,kind,map_id) values(?,?,?,?,?,?)",t_dataset);
        jdbcTemplate.update(sql,
                new Object[]{
                        dataSetDO.getName(),
                        dataSetDO.getMemo(),
                        dataSetDO.getRecordDate(),
                        dataSetDO.getGroup(),
                        dataSetDO.getKind(),
                        dataSetDO.getMapId()
                },
                new int[]{
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.INTEGER,
                        Types.BIGINT
                });
    }

    public void updateDataSet(DataSetDO dataSetDO){
        String sql=String.format("update %s set name=?,memo=?,record_date=?,layer_group=?,kind=?,map_id=?,modify_time=now() where id=?",t_dataset);
        jdbcTemplate.update(sql,
                new Object[]{
                        dataSetDO.getName(),
                        dataSetDO.getMemo(),
                        dataSetDO.getRecordDate(),
                        dataSetDO.getGroup(),
                        dataSetDO.getKind(),
                        dataSetDO.getMapId(),
                        dataSetDO.getId()
                },
                new int[]{
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.INTEGER,
                        Types.BIGINT,
                        Types.BIGINT
                });
    }

    public void delDataSet(long id){
        String sql=String.format("delete from %s where id=?",t_dataset);
        jdbcTemplate.update(sql,new Object[]{id},new int[]{Types.BIGINT});
    }

    public void saveRow(String sql,Object[] objects,int[] types){
        jdbcTemplate.update(sql,objects,types);
    }

    private DataSetDO toDataSetDO(ResultSet rs)throws SQLException{
        DataSetDO u=new DataSetDO();
        u.setId(rs.getLong("id"));
        u.setMapId(rs.getLong("map_id"));
        u.setName(rs.getString("name"));
        u.setMemo(rs.getString("memo"));
        u.setRecordDate(rs.getString("record_date"));
        u.setGroup(rs.getString("layer_group"));
        u.setKind(rs.getInt("kind"));
        u.setCreateTime(rs.getTimestamp("create_time"));
        u.setModifyTime(rs.getTimestamp("modify_time"));
        return u;
    }
}
