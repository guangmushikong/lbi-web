
package com.lbi.tile.model;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/*************************************
 * Class Name: UserDO
 * Description:〈UserDO〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Data
public class UserDO {
    /**
     * 主键
     */
    Long id;
    /**
     * 用户名
     */
    String username;
    /**
     * 密码
     */
    String password;
    /**
     * 昵称
     */
    String nick;
    /**
     * 手机
     */
    String mobile;
    /**
     * 邮件
     */
    String email;
    /**
     * 角色ID
     */
    Long roleId;
    /**
     * 项目ID
     */
    String projectIds;
    /**
     * 创建时间
     */
    @JSONField(format = "yyyy-MM-dd HH:mm:ss.SSS")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS", locale = "zh", timezone = "GMT+8")
    Date createTime;
    /**
     * 修改时间
     */
    @JSONField(format = "yyyy-MM-dd HH:mm:ss.SSS")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS", locale = "zh", timezone = "GMT+8")
    Date modifyTime;
}
