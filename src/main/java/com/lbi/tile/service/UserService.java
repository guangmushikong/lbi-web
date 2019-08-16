
package com.lbi.tile.service;

import com.lbi.tile.model.SysUser;
import com.lbi.tile.dao.UserDao;
import com.lbi.tile.model.UserDO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;


/*************************************
 * Class Name: UserService
 * Description:〈自定用用户服务〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Service
@Slf4j
public class UserService implements UserDetailsService {
    @Autowired
    UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        SysUser user = userDao.findByUsername(userName);
        if (null==user) {
            throw new UsernameNotFoundException("用户名不存在");
        }
        return user;
    }

    public List<UserDO> listUser(){
        return userDao.listUser();
    }

    public void addUser(UserDO userDO){
        userDao.addUser(userDO);
    }

    public void updateUser(UserDO userDO){
        userDao.updateUser(userDO);
    }

    public void delUser(long id){
        userDao.delUser(id);
    }
}
