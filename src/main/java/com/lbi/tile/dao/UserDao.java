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
import org.springframework.dao.support.DataAccessUtils;
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
        String sql="select * from t_sys_user where username=?";
        return DataAccessUtils.requiredSingleResult(
                jdbcTemplate.query(
                        sql,
                        new Object[]{username},
                        new int[]{Types.VARCHAR},
                        (rs,rowNum)->toSysUser(rs))
        );
    }

    public SysRole findRoleById(long roleId){
        String sql="select * from t_sys_role where id=?";
        return DataAccessUtils.requiredSingleResult(
                jdbcTemplate.query(
                        sql,
                        new Object[]{roleId},
                        new int[]{Types.BIGINT},
                        (rs,rowNum)->toSysRole(rs))
        );
    }

    private SysUser toSysUser(ResultSet rs)throws SQLException{
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

    private SysRole toSysRole(ResultSet rs)throws SQLException{
        SysRole u=new SysRole();
        u.setId(rs.getLong("id"));
        u.setName(rs.getString("name"));
        return u;
    }
}
