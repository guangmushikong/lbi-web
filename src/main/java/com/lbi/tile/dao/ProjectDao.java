package com.lbi.tile.dao;

import com.lbi.tile.model.ProjectDO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

/*************************************
 * Class Name: ProjectDao
 * Description:〈Project〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Repository
public class ProjectDao extends CommonDao{
    @Value("${spring.table.t_project}")
    String t_project;

    public List<ProjectDO> listProject(){
        String sql=String.format("select * from %s order by id",t_project);
        return jdbcTemplate.query(sql, (rs,rowNum)->toProjectDO(rs));
    }

    public ProjectDO getProject(long id){
        String sql=String.format("select * from %s where id=?",t_project);
        List<ProjectDO> list=jdbcTemplate.query(
                sql,
                new Object[]{id},
                new int[]{Types.BIGINT},
                (rs,rowNum)->toProjectDO(rs));

        if(list.isEmpty()){
            return null;
        }else {
            return list.get(0);
        }
    }

    public void addProject(ProjectDO projectDO){
        String sql=String.format("insert into %s(name,memo,dataset_ids) values(?,?,?)",t_project);
        jdbcTemplate.update(sql,
                new Object[]{
                        projectDO.getName(),
                        projectDO.getMemo(),
                        projectDO.getDatasetIds()
                },
                new int[]{
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR
                });
    }

    public void updateProject(ProjectDO projectDO){
        String sql=String.format("update %s set name=?,memo=?,dataset_ids=?,modify_time=now() where id=?",t_project);
        jdbcTemplate.update(sql,
                new Object[]{
                        projectDO.getName(),
                        projectDO.getMemo(),
                        projectDO.getDatasetIds(),
                        projectDO.getId()
                },
                new int[]{
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.BIGINT
                });
    }

    public void delProject(long id){
        String sql=String.format("delete from %s where id=?",t_project);
        jdbcTemplate.update(sql,new Object[]{id},new int[]{Types.BIGINT});
    }

    private ProjectDO toProjectDO(ResultSet rs)throws SQLException {
        ProjectDO u=new ProjectDO();
        u.setId(rs.getLong("id"));
        u.setName(rs.getString("name"));
        u.setMemo(rs.getString("memo"));
        u.setDatasetIds(rs.getString("dataset_ids"));
        u.setCreateTime(rs.getTimestamp("create_time"));
        u.setModifyTime(rs.getTimestamp("modify_time"));
        return u;
    }
}
