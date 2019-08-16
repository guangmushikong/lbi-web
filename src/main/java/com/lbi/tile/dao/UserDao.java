package com.lbi.tile.dao;

import com.lbi.tile.model.SysRole;
import com.lbi.tile.model.SysUser;
import com.lbi.tile.model.UserDO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

/*************************************
 * Class Name: UserDao
 * Description:〈系统用户Dao〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Repository
@Slf4j
public class UserDao extends CommonDao{
    @Value("${spring.table.t_sys_role}")
    String t_sys_role;
    @Value("${spring.table.t_sys_user}")
    String t_sys_user;

    public List<UserDO> listUser(){
        String sql=String.format("select * from %s order by id",t_sys_user);
        return jdbcTemplate.query(sql, (rs,rowNum)->toUserDO(rs));
    }

    public SysUser findByUsername(String username){
        String sql=String.format("select * from %s where username=?",t_sys_user);
        List<SysUser> list=jdbcTemplate.query(
                sql,
                new Object[]{username},
                new int[]{Types.VARCHAR},
                (rs,rowNum)->toSysUser(rs));
        if(list.isEmpty()){
            return null;
        }else {
            return list.get(0);
        }
    }

    private SysRole findRoleById(long id){
        String sql=String.format("select * from %s where id=?",t_sys_role);
        List<SysRole> list=jdbcTemplate.query(
                sql,
                new Object[]{id},
                new int[]{Types.BIGINT},
                (rs,rowNum)->toSysRole(rs));
        if(list.isEmpty()){
            return null;
        }else {
            return list.get(0);
        }
    }

    public void addUser(UserDO userDO){
        String sql=String.format("insert into %s(username,password,nick,mobile,email,role_id,project_ids) values(?,?,?,?,?,?,?)",t_sys_user);
        jdbcTemplate.update(sql,
                new Object[]{
                        userDO.getUsername(),
                        userDO.getPassword(),
                        userDO.getNick(),
                        userDO.getMobile(),
                        userDO.getEmail(),
                        userDO.getRoleId(),
                        userDO.getProjectIds()
                },
                new int[]{
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.BIGINT,
                        Types.VARCHAR
                });
    }

    public void updateUser(UserDO userDO){
        String sql=String.format("update %s set password=?,nick=?,mobile=?,email=?,role_id=?,project_ids=?,modify_time=now() where id=?",t_sys_user);
        jdbcTemplate.update(sql,
                new Object[]{
                        userDO.getPassword(),
                        userDO.getNick(),
                        userDO.getMobile(),
                        userDO.getEmail(),
                        userDO.getRoleId(),
                        userDO.getProjectIds(),
                        userDO.getId(),
                },
                new int[]{
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.VARCHAR,
                        Types.BIGINT,
                        Types.VARCHAR,
                        Types.BIGINT
                });
    }

    public void delUser(long id){
        String sql=String.format("delete from %s where id=?",t_sys_user);
        jdbcTemplate.update(sql,new Object[]{id},new int[]{Types.BIGINT});
    }

    private UserDO toUserDO(ResultSet rs)throws SQLException{
        UserDO u=new UserDO();
        u.setId(rs.getLong("id"));
        u.setUsername(rs.getString("username"));
        u.setPassword(rs.getString("password"));
        u.setNick(rs.getString("nick"));
        u.setMobile(rs.getString("mobile"));
        u.setEmail(rs.getString("email"));
        u.setRoleId(rs.getLong("role_id"));
        u.setProjectIds(rs.getString("project_ids"));
        u.setCreateTime(rs.getTimestamp("create_time"));
        u.setModifyTime(rs.getTimestamp("modify_time"));

        return u;
    }

    private SysUser toSysUser(ResultSet rs)throws SQLException{
        SysUser u=new SysUser();
        u.setId(rs.getLong("id"));
        u.setUsername(rs.getString("username"));
        u.setPassword(rs.getString("password"));
        u.setNick(rs.getString("nick"));
        u.setMobile(rs.getString("mobile"));
        u.setEmail(rs.getString("email"));
        u.setProjectIds(rs.getString("project_ids"));
        u.setRoleId(rs.getLong("role_id"));
        //get Role
        List<SysRole> list=new ArrayList<>();
        SysRole role=findRoleById(u.getRoleId());
        if(role!=null){
            list.add(role);
        }
        u.setRoles(list);

        return u;
    }

    private SysRole toSysRole(ResultSet rs)throws SQLException{
        SysRole u=new SysRole();
        u.setId(rs.getLong("id"));
        u.setName(rs.getString("name"));
        return u;
    }
}
