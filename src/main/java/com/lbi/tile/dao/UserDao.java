/**************************************
 * Copyright (C), Navinfo
 * Package: com.pl.admin.dao
 * Author: liumingkai05559
 * Date: Created in 2018/6/4 15:18
 **************************************/
package com.lbi.tile.dao;

import com.lbi.tile.model.SysRole;
import com.lbi.tile.model.SysUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

/*************************************
 * Class Name: UserDao
 * Description:〈系统用户Dao〉
 * @author liumingkai
 * @create 2018/6/4
 * @since 1.0.0
 ************************************/
@Repository(value="userDao")
@Slf4j
public class UserDao extends CommonDao{
    @Value("${spring.table.t_sys_role}")
    String t_sys_role;
    @Value("${spring.table.t_sys_user}")
    String t_sys_user;

    public SysUser findByUsername(String username){
        try{
            String sql="select * from "+t_sys_user+" where username=?";
            List<SysUser> list=jdbcTemplate.query(
                    sql,
                    new Object[]{username},
                    new int[]{Types.VARCHAR},
                    new RowMapper<SysUser>() {
                        public SysUser mapRow(ResultSet rs, int i) throws SQLException {
                            SysUser u=new SysUser();
                            u.setId(rs.getLong("id"));
                            u.setUsername(rs.getString("username"));
                            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
                            String encode=encoder.encode(rs.getString("password")).trim();
                            u.setPassword(encode);
                            u.setEmail(rs.getString("email"));
                            long roleId=rs.getLong("role_id");
                            //get Role
                            List<SysRole> list=new ArrayList<>();
                            SysRole role=findRoleById(roleId);
                            list.add(role);
                            u.setRoles(list);

                            return u;
                        }
                    });
            if(list.size()>0)return list.get(0);
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
        }
        return null;
    }
    public SysRole findRoleById(long roleId){
        try{
            String sql="select * from "+t_sys_role+" where id=?";
            List<SysRole> list=jdbcTemplate.query(
                    sql,
                    new Object[]{roleId},
                    new int[]{Types.BIGINT},
                    new RowMapper<SysRole>() {
                        public SysRole mapRow(ResultSet rs, int i) throws SQLException {
                            SysRole u=new SysRole();
                            u.setId(rs.getLong("id"));
                            u.setName(rs.getString("name"));
                            return u;
                        }
                    });
            if(list.size()>0)return list.get(0);
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
        }
        return null;
    }
}
