package com.lbi.tile.dao;

import com.lbi.tile.model.Stat;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.List;

@Repository
@Slf4j
public class LogDao extends CommonDao{
    @Value("${spring.table.t_log}")
    String t_log;

    public List<Stat> getLogStat(String sql){
        return jdbcTemplate.query(
                sql,
                (rs,rowNum)->toStat(rs));
    }


    /**
     * 获取统计Top IP列表
     * @param kind  1大于且等于,2等于
     * @param ds    日期
     * @param limit 限制
     * @param filterIPs 过滤IP列表
     * @return IP列表
     */
    public List<String> getTopIpList(int kind,long ds,int limit,List<String> filterIPs){
        StringBuilder sb=new StringBuilder();
        sb.append("select ip from "+t_log);
        if(kind==1){
            sb.append(" where to_char(log_time,'yyyymmdd')::bigint>="+ds);
        }else{
            sb.append(" where to_char(log_time,'yyyymmdd')::bigint="+ds);
        }
        if(filterIPs!=null){
            sb.append(" and ip not in ('"+StringUtils.join(filterIPs,"','")+"')");
        }
        sb.append(" group by ip");
        sb.append(" order by count(1) desc limit "+limit);
        //System.out.println("sql:"+sb.toString());
        return jdbcTemplate.query(
                sb.toString(),
                (rs,rowNum)->rs.getString("ip"));
    }

    private Stat toStat(ResultSet rs)throws SQLException{
        Stat u=new Stat();
        u.setName(rs.getString("ip"));
        u.setPeriod(rs.getLong("time"));
        u.setTotal(rs.getLong("total"));
        return u;
    }

}
