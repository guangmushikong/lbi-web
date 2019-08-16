
package com.lbi.tile.controller;

import com.alibaba.fastjson.JSON;
import com.lbi.tile.model.ResultBody;
import com.lbi.tile.model.UserDO;
import com.lbi.tile.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*************************************
 * Class Name: UserController
 * Description:〈用户Controller〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@CrossOrigin
@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping(value="/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody listUser() {
        List<UserDO> list=userService.listUser();
        return new ResultBody<>(list);
    }

    @PostMapping(value="/add", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody addUser(@RequestBody UserDO userDO) {
        log.info("【addUser】"+ JSON.toJSONString(userDO));
        userService.addUser(userDO);
        return new ResultBody<>();
    }

    @PostMapping(value="/save", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody updateUser(@RequestBody UserDO userDO) {
        log.info("【updateUser】"+ JSON.toJSONString(userDO));
        userService.updateUser(userDO);
        return new ResultBody<>();
    }

    @GetMapping(value="/del", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody delUser(@RequestParam("id") long id) {
        log.info("【delUser】id:{}",id);
        userService.delUser(id);
        return new ResultBody<>();
    }
}
