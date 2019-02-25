package com.lbi.tile.dao;

import com.lbi.tile.model.DataSetDO;
import com.lbi.tile.model.ProjectDO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

@Repository(value="metaDao")
public class MetaDao extends CommonDao {
    @Value("${spring.table.t_project}")
    String t_project;
    @Value("${spring.table.t_dataset}")
    String t_dataset;

    public List<ProjectDO> getProjectList(){
        List<ProjectDO> list=null;
        try{
            StringBuilder sb=new StringBuilder();
            sb.append("select * from "+t_project);
            sb.append(" order by id");
            list=jdbcTemplate.query(
                    sb.toString(),
                    new RowMapper<ProjectDO>() {
                        public ProjectDO mapRow(ResultSet rs, int i) throws SQLException {
                            ProjectDO u=new ProjectDO();
                            u.setId(rs.getLong("id"));
                            u.setName(rs.getString("name"));
                            u.setMemo(rs.getString("memo"));
                            u.setCreateTime(rs.getTimestamp("create_time"));
                            u.setModifyTime(rs.getTimestamp("modify_time"));
                            return u;
                        }
                    });
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return list;
    }

    public ProjectDO getProjectById(long id){
        try{
            String sql="select * from "+t_project+" where id=?";
            List<ProjectDO>  list=jdbcTemplate.query(
                    sql,
                    new Object[]{id},
                    new int[]{Types.BIGINT},
                    new RowMapper<ProjectDO>() {
                        public ProjectDO mapRow(ResultSet rs, int i) throws SQLException {
                            ProjectDO u=new ProjectDO();
                            u.setId(rs.getLong("id"));
                            u.setName(rs.getString("name"));
                            u.setMemo(rs.getString("memo"));
                            u.setCreateTime(rs.getTimestamp("create_time"));
                            u.setModifyTime(rs.getTimestamp("modify_time"));
                            return u;
                        }
                    });
            if(list.size()>0)return list.get(0);
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return null;
    }

    public List<DataSetDO> getDataSetList(){
        List<DataSetDO> list=null;
        try{
            String sql="select * from "+t_dataset+" order by name";
            list=jdbcTemplate.query(
                    sql,
                    new RowMapper<DataSetDO>() {
                        public DataSetDO mapRow(ResultSet rs, int i) throws SQLException {
                            DataSetDO u=new DataSetDO();
                            u.setId(rs.getLong("id"));
                            u.setMapId(rs.getLong("map_id"));
                            u.setName(rs.getString("name"));
                            u.setMemo(rs.getString("memo"));
                            u.setRecordDate(rs.getString("record_date"));
                            u.setType(rs.getInt("type"));
                            u.setGroup(rs.getString("layer_group"));
                            u.setKind(rs.getInt("kind"));
                            u.setCreateTime(rs.getTimestamp("create_time"));
                            u.setModifyTime(rs.getTimestamp("modify_time"));
                            return u;
                        }
                    });
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return list;
    }

    public DataSetDO getDataSetById(long id){
        try{
            String sql="select * from "+t_dataset+" where id=?";
            List<DataSetDO>  list=jdbcTemplate.query(
                    sql,
                    new Object[]{id},
                    new int[]{Types.BIGINT},
                    new RowMapper<DataSetDO>() {
                        public DataSetDO mapRow(ResultSet rs, int i) throws SQLException {
                            DataSetDO u=new DataSetDO();
                            u.setId(rs.getLong("id"));
                            u.setMapId(rs.getLong("map_id"));
                            u.setName(rs.getString("name"));
                            u.setMemo(rs.getString("memo"));
                            u.setRecordDate(rs.getString("record_date"));
                            u.setType(rs.getInt("type"));
                            u.setGroup(rs.getString("layer_group"));
                            u.setKind(rs.getInt("kind"));
                            u.setCreateTime(rs.getTimestamp("create_time"));
                            u.setModifyTime(rs.getTimestamp("modify_time"));
                            return u;
                        }
                    });
            if(list.size()>0)return list.get(0);
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return null;
    }
}
